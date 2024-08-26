document.addEventListener("DOMContentLoaded", function() {
    const uniqueKeywords = Array.from(data.reduce((acc, item) => {
        item.keywords.forEach(k => acc.add(k.text));
        return acc;
    }, new Set()));
    
    const defaultKeywordCount = Math.min(150, Math.ceil(uniqueKeywords.length * 0.5));
    initializeGraph(data, defaultKeywordCount);

    document.getElementById('updateGraph').addEventListener('click', function() {
        let keywordCount = parseInt(document.getElementById('keywordCount').value, 10);
        if (isNaN(keywordCount) || keywordCount <= 0) {
            keywordCount = defaultKeywordCount;
        }
        document.getElementById('keywordCount').value = keywordCount;
        initializeGraph(data, keywordCount);
    });
});

function initializeGraph(data, keywordCount) {
    const sentences = data;

    // Calculate document frequencies and initialize TF-IDF score storage
    const wordDocCounts = {};
    const termFreqs = {};
    const totalDocuments = sentences.length;

    // Step 1: Calculate document frequency (DF) for each keyword
    sentences.forEach(d => {
        const keywordSet = new Set();
        d.keywords.forEach(k => {
            if (!keywordSet.has(k.text)) {
                wordDocCounts[k.text] = (wordDocCounts[k.text] || 0) + 1;
                keywordSet.add(k.text);
            }
        });
    });

    // Step 2: Calculate term frequency (TF) for each keyword across all sentences
    sentences.forEach(d => {
        d.keywords.forEach(k => {
            termFreqs[k.text] = (termFreqs[k.text] || 0) + 1;
        });
    });

    // Step 3: Calculate TF-IDF scores for each keyword
    const tfidfScores = {};
    Object.keys(termFreqs).forEach(keyword => {
        const tf = termFreqs[keyword] / totalDocuments;
        const idf = Math.log(totalDocuments / (wordDocCounts[keyword] || 1));
        tfidfScores[keyword] = tf * idf;
    });

    // Sort keywords based on combined TF-IDF scores in descending order
    const sortedKeywords = Object.entries(tfidfScores).sort((a, b) => b[1] - a[1]);

    // Calculate the number of keywords to select
    const numKeywordsToSelect = Math.min(keywordCount, sortedKeywords.length);

    // Get top keywords based on combined TF-IDF scores
    const topKeywords = sortedKeywords.slice(0, numKeywordsToSelect).map(([keyword]) => keyword);

    // Build graph data
    const nodes = topKeywords.map(keyword => ({ id: keyword, frequency: wordDocCounts[keyword] }));
    const links = [];
    const linkCounts = new Map();

    sentences.forEach(d => {
        const sentenceKeywords = [...new Set(d.keywords.filter(keyword => topKeywords.includes(keyword.text)).map(k => k.text))];
        for (let i = 0; i < sentenceKeywords.length; i++) {
            for (let j = i + 1; j < sentenceKeywords.length; j++) {
                const pair = JSON.stringify([sentenceKeywords[i], sentenceKeywords[j]].sort());
                linkCounts.set(pair, (linkCounts.get(pair) || 0) + 1);
            }
        }
    });

    linkCounts.forEach((count, pair) => {
        const [source, target] = JSON.parse(pair);
        links.push({ source, target, count });
    });

    // Scale for font sizes based on keyword frequency
    const fontSizeScale = d3.scaleLinear()
        .domain(d3.extent(nodes, d => d.frequency))
        .range([10, 60]);  // Adjust range for readability

    // Scale for link stroke width based on co-occurrence count
    const strokeWidthScale = d3.scaleLinear()
        .domain(d3.extent(links, d => d.count))
        .range([0.5, 10]);

    // Clear previous graph
    d3.select('#graph').selectAll('*').remove();

    // Draw graph using D3.js
    const width = document.getElementById('graph').clientWidth;
    const height = document.getElementById('graph').clientHeight;

    const svg = d3.select('#graph').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .call(d3.zoom().on('zoom', (event) => {
            g.attr('transform', event.transform);
        }));

    const g = svg.append('g');

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-300)) // Increased repulsion
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => fontSizeScale(d.frequency) + 10)); // Increased collision radius

    const link = g.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke-width', d => strokeWidthScale(d.count))
        .attr('stroke', '#999')
        .style('opacity', 0.05); // Initially low opacity

    const node = g.append('g')
        .selectAll('g')
        .data(nodes)
        .enter().append('g')
        .call(drag(simulation))
        .on('click', function(event, d) {
            const selected = d3.select(this).classed('selected');
            d3.select(this).classed('selected', !selected);
            d3.select(this).select('circle').attr('fill', !selected ? 'red' : '#69b3a2');
            updateLinks();
            updateSidebar(getSelectedKeywords(), sentences, 1);
        });

    node.append('circle')
        .attr('r', 5)
        .attr('fill', '#69b3a2');

    node.append('text')
        .attr('dy', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', d => `${fontSizeScale(d.frequency)}px`)
        .text(d => d.id);

    node.append('title')
        .text(d => d.id);

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Initial sidebar message
    d3.select('#details').html('<p>Click a node to see more details</p>');

    // Drag functionality
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    // Get selected keywords
    function getSelectedKeywords() {
        return d3.selectAll('g.selected').data().map(d => d.id);
    }

    // Update link visibility based on selected nodes
    function updateLinks() {
        const selectedKeywords = getSelectedKeywords();
        const selectedSet = new Set(selectedKeywords);

        link.style('opacity', d => {
            if (selectedSet.size === 1) {
                return selectedSet.has(d.source.id) || selectedSet.has(d.target.id) ? 0.5 : 0.05;
            } else if (selectedSet.size > 1) {
                if (selectedSet.has(d.source.id) && selectedSet.has(d.target.id)) {
                    return 1;
                } else if (selectedSet.has(d.source.id) || selectedSet.has(d.target.id)) {
                    return 0.5;
                } else {
                    return 0.05;
                }
            } else {
                return 0.05;
            }
        }).attr('stroke', d => {
            if (selectedSet.size > 1 && selectedSet.has(d.source.id) && selectedSet.has(d.target.id)) {
                return 'orange';
            } else {
                return '#999';
            }
        }).attr('stroke-width', d => strokeWidthScale(d.count)); // Ensure consistent stroke width
    }

    // Sidebar update functionality with pagination
    function updateSidebar(selectedKeywords, sentences, page) {
        const itemsPerPage = 10;
        const sidebar = d3.select('#details').html('');

        if (selectedKeywords.length === 0) {
            sidebar.text('Click a node to see more details');
            return;
        }

        const keywordSet = new Set(selectedKeywords.map(kw => kw.toLowerCase()));
        const matchedSentences = sentences.filter(d => {
            const tokens = new Set(d.keywords.map(kw => kw.text.toLowerCase()));
            return [...keywordSet].every(kw => tokens.has(kw));
        });

        const selectedFrequencies = selectedKeywords.map(kw => ({
            keyword: kw,
            frequency: wordDocCounts[kw]
        }));

        const coOccurrenceCount = matchedSentences.length;

        sidebar.append('h3').text('Selected Keywords');
        const keywordList = sidebar.append('div').attr('class', 'keyword-list');
        selectedFrequencies.forEach(d => {
            const keywordButton = keywordList.append('button')
                .attr('class', 'keyword-button')
                .html(`${d.keyword} <span class="remove">&times;</span>`)
                .on('click', () => {
                    deselectKeyword(d.keyword);
                });
        });

        sidebar.append('h3').text('Keyword Occurrences');
        selectedFrequencies.forEach(d => {
            sidebar.append('p').text(`${d.keyword}: ${d.frequency}`);
        });

        if (selectedKeywords.length > 1) {
            sidebar.append('p').text(`Co-occurrence of {${selectedKeywords.join(', ')}}: ${coOccurrenceCount}`);
        }

        if (matchedSentences.length === 0) {
            sidebar.append('p').text('No sentences to show');
        } else {
            sidebar.append('h3').text('Sentences');
            const table = sidebar.append('table'); // Use table instead of ul
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, matchedSentences.length);

            matchedSentences.slice(startIndex, endIndex).forEach(d => {
                const highlightedSentence = highlightKeywords(d.sentence, d.keywords, selectedKeywords);
                const row = table.append('tr');
                row.append('td').text(`${sentences.indexOf(d) + 1}.`).style('text-align', 'right').style('padding-right', '5px');
                row.append('td').html(highlightedSentence).style('padding-left', '5px');
            });

            const pageCount = Math.ceil(matchedSentences.length / itemsPerPage);
            const maxPagesToShow = 5;
            const halfPagesToShow = Math.floor(maxPagesToShow / 2);
            let startPage = Math.max(1, page - halfPagesToShow);
            let endPage = Math.min(pageCount, page + halfPagesToShow);

            if (page <= halfPagesToShow) {
                endPage = Math.min(pageCount, maxPagesToShow);
            } else if (page + halfPagesToShow >= pageCount) {
                startPage = Math.max(1, pageCount - maxPagesToShow + 1);
            }

            if (pageCount > 1) {
                const pagination = sidebar.append('div').attr('class', 'pagination');
                if (page > 1) {
                    pagination.append('a')
                        .attr('href', '#')
                        .text('«')
                        .on('click', () => updateSidebar(selectedKeywords, sentences, page - 1));
                }
                for (let i = startPage; i <= endPage; i++) {
                    pagination.append('a')
                        .attr('href', '#')
                        .classed('active', i === page)
                        .text(i)
                        .on('click', () => updateSidebar(selectedKeywords, sentences, i));
                }
                if (page < pageCount) {
                    pagination.append('a')
                        .attr('href', '#')
                        .text('»')
                        .on('click', () => updateSidebar(selectedKeywords, sentences, page + 1));
                }
            }
        }
    }

    function deselectKeyword(keyword) {
        // Deselect the keyword in the graph
        d3.selectAll('g.selected').each(function(d) {
            if (d.id === keyword) {
                d3.select(this).classed('selected', false);
                d3.select(this).select('circle').attr('fill', '#69b3a2');
            }
        });

        // Update the links and sidebar
        updateLinks();
        updateSidebar(getSelectedKeywords(), sentences, 1);
    }

    function highlightKeywords(sentence, keywords, selectedKeywords) {
        let highlightedSentence = '';
        let currentIndex = 0;

        keywords.sort((a, b) => a.start - b.start); // Sort keywords by start position

        keywords.forEach(keyword => {
            if (selectedKeywords.includes(keyword.text)) {
                // Append the part of the sentence before the keyword
                highlightedSentence += sentence.substring(currentIndex, keyword.start);

                // Append the highlighted keyword
                highlightedSentence += `<span class="keyword">${sentence.substring(keyword.start, keyword.stop)}</span>`;

                // Update the current index
                currentIndex = keyword.stop;
            }
        });

        // Append the rest of the sentence after the last keyword
        highlightedSentence += sentence.substring(currentIndex);

        return highlightedSentence;
    }








    // Get references to the buttons
    const drawButton = document.getElementById('drawModeBtn');
    const zoomButton = document.getElementById('zoomModeBtn');


    let mode = 'zoom'; // Default mode
    let isDrawing = false;
    let rect, startX, startY;
    let currentTransform = d3.zoomIdentity; // Store the current zoom transform

    // Make the mode buttons visible
    drawButton.style.visibility = 'visible';
    zoomButton.style.visibility = 'visible';

    // Set active button and mode
    function setActiveButton(activeButton) {
        drawButton.classList.remove('active');
        zoomButton.classList.remove('active');
        activeButton.classList.add('active');
    }

    // Handle Draw Mode
    drawButton.addEventListener('click', function() {
        setActiveButton(drawButton);
        mode = 'draw';
        enableDrawMode();
    });

    // Handle Zoom Mode
    zoomButton.addEventListener('click', function() {
        setActiveButton(zoomButton);
        mode = 'zoom';
        enableZoomMode();
    });

    // Enable drawing mode (disable zoom)
    function enableDrawMode() {
        svg.on('.zoom', null); // Disable zoom and pan
        svg.on('mousedown', startDrawing); // Enable drawing
    }

    // Enable zoom mode only (disable drawing)
    function enableZoomMode() {
        svg.call(zoomBehavior); // Enable zoom and pan
        svg.on('mousedown', null); // Disable drawing
        svg.on('mousemove', null);
        svg.on('mouseup', null);
    }

    // Zoom behavior
    const zoomBehavior = d3.zoom()
        .scaleExtent([0.5, 5])
        .on('zoom', function(event) {
            currentTransform = event.transform; // Update the current zoom transform
            g.attr('transform', currentTransform); // Apply zoom and pan
        });

    // Initialize in zoom mode
    enableZoomMode();

    // Start drawing the rectangle
    function startDrawing(event) {
        if (mode !== 'draw') return;

        const [x, y] = d3.pointer(event, svg.node());
        startX = currentTransform.invertX(x); // Apply inverse of zoom to get the original coordinates
        startY = currentTransform.invertY(y);
        rect = g.append('rect')
            .attr('x', startX)
            .attr('y', startY)
            .attr('width', 0)
            .attr('height', 0)
            .attr('fill', 'rgba(0, 0, 255, 0.1)')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1);
        isDrawing = true;

        svg.on('mousemove', continueDrawing);
        svg.on('mouseup', finishDrawing);
        window.addEventListener('mouseup', finishDrawing);
        svg.on('mouseleave', edgeDrawing);  // Handle leaving the SVG
        svg.on('mouseenter', resumeDrawing);  // Handle re-entering the SVG
        
     
    }

    // Continue drawing the rectangle as the mouse moves
    function continueDrawing(event) {
        if (!isDrawing) return;
        const [x, y] = d3.pointer(event, svg.node());
        const newX = currentTransform.invertX(x); // Apply inverse of zoom to get the original coordinates
        const newY = currentTransform.invertY(y);
        const width = Math.abs(newX - startX);
        const height = Math.abs(newY - startY);
        rect.attr('width', width).attr('height', height);
        if (newX < startX) rect.attr('x', newX); // Adjust position if dragging left/up
        if (newY < startY) rect.attr('y', newY);
    }

    // Handle when the mouse leaves the SVG
    function edgeDrawing(event) {
        if (!isDrawing) return;
        const svgRect = svg.node().getBoundingClientRect();
        let [x, y] = d3.pointer(event);
    
        // Clamp x and y based on where the mouse left the SVG
        if (x < svgRect.left) x = svgRect.left;
        if (x > svgRect.right) x = svgRect.right;
        if (y < svgRect.top) y = svgRect.top;
        if (y > svgRect.bottom) y = svgRect.bottom;
    
        const clampedX = currentTransform.invertX(x); // Inverse transform for X
        const clampedY = currentTransform.invertY(y); // Inverse transform for Y
    
        // Update rectangle dimensions based on the clamped values
        const width = Math.abs(clampedX - startX);
        const height = Math.abs(clampedY - startY);
    
        rect.attr('width', width).attr('height', height);
        if (clampedX < startX) rect.attr('x', clampedX); // Adjust position if dragging left/up
        if (clampedY < startY) rect.attr('y', clampedY);
    }

    // Handle when the mouse re-enters the SVG, continue drawing
    function resumeDrawing(event) {
        if (!isDrawing) return;
        svg.on('mousemove', continueDrawing);
    }



    // Finish drawing the rectangle and highlight nodes within it
    function finishDrawing(event) {
        if (!isDrawing) return;
        isDrawing = false;

        // Get rectangle dimensions in original (untransformed) coordinates
        const rectX = parseFloat(rect.attr('x'));
        const rectY = parseFloat(rect.attr('y'));
        const rectWidth = parseFloat(rect.attr('width'));
        const rectHeight = parseFloat(rect.attr('height'));

        // Check which circles (nodes) are inside the rectangle
        const selectedNodes = [];
        d3.selectAll('circle').each(function(d) {
            const [cx, cy] = [d.x, d.y]; // Coordinates in original space (before zoom)
            if (cx >= rectX && cx <= rectX + rectWidth &&
                cy >= rectY && cy <= rectY + rectHeight) {
                selectedNodes.push(d);
                d3.select(this).attr('fill', 'red'); // Highlight the node
                d3.select(this.parentNode).classed('selected', true);
            }
        });

        // Show export button if any nodes were selected
        if (selectedNodes.length > 0) {
            exportButton.style.visibility = 'visible'; // Show the export button
            updateLinks();
            updateSidebar(getSelectedKeywords(), sentences, 1);
        }

        // Remove the rectangle after selection
        rect.remove();

        // Remove drawing-related events
        svg.on('mousemove', null);
        svg.on('mouseup', null);
        svg.on('mouseleave', null); // Clean up the event listener
        svg.on('mouseenter', null);  // Clean up the re-enter event listener
        window.removeEventListener('mouseup', finishDrawing);  
        
    }

    // Handle export button click
    exportButton.addEventListener('click', function() {
        const selectedSentenceIds = new Set(); // Use a Set to avoid duplicates

        // Get all selected g elements and process them
        d3.selectAll('g.selected').each(function() {
            const gElement = d3.select(this);
            const circle = gElement.select('circle');
            const circleText = gElement.select('text').text().trim(); // Get the circle's text

            // Search the dataset for matching keywords and collect sentence IDs
            data.forEach(item => {
                item.keywords.forEach(keyword => {
                    if (keyword.text.toLowerCase() === circleText.toLowerCase()) {
                        selectedSentenceIds.add(item.id); // Add the sentence ID to the set
                    }
                });
            });
        });

        // Prepare the data for CSV export
        const rows = [['ID']]; // Header for the CSV file
        selectedSentenceIds.forEach(id => {
            rows.push([id]); // Add each unique sentence ID
        });

        // Convert rows to CSV format
        const csvContent = rows.map(e => e.join(",")).join("\n");

        // Create a downloadable CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "selected_sentences.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });





}

