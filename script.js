document.addEventListener("DOMContentLoaded", function() {
    initializeGraph(data);
});

function initializeGraph(data) {
    const sentences = data;

    // Calculate keyword frequencies
    const wordDocCounts = {};
    const namedEntities = new Set();
    
    sentences.forEach(d => {
        d.keywords.forEach(k => {
            if (k.type === 'named entity') {
                namedEntities.add(k.text);
            }
            wordDocCounts[k.text] = (wordDocCounts[k.text] || 0) + 1;
        });
    });

    // Separate named entities from other keywords
    const namedEntitiesArray = Array.from(namedEntities);
    const otherKeywordsArray = Object.entries(wordDocCounts)
        .filter(([keyword]) => !namedEntities.has(keyword))
        .sort((a, b) => b[1] - a[1]);

    // Get top 30% of other keywords based on frequency
    const topOtherKeywords = otherKeywordsArray
        .slice(0, Math.ceil(otherKeywordsArray.length*0.3))
        .map(([keyword]) => keyword);

    // Combine named entities and top other keywords
    const topKeywords = namedEntitiesArray.concat(topOtherKeywords);

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
    d3.select('#sidebar').html('<p>Click a node to see more details</p>');

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
        const sidebar = d3.select('#sidebar').html('');

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

            if (pageCount > 1) {
                const pagination = sidebar.append('div').attr('class', 'pagination');
                if (page > 1) {
                    pagination.append('a')
                        .attr('href', '#')
                        .text('«')
                        .on('click', () => updateSidebar(selectedKeywords, sentences, page - 1));
                }
                for (let i = 1; i <= pageCount; i++) {
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
}
