# keyword Visualization
This project visualizes a graph based on the frequency of keywords from a set of sentences. The graph highlights the relationships between keywords, and the sidebar provides detailed information about the selected keywords, their occurrence, and the sentences in which they appear.

## Files in the Project
1. index.html: The main HTML file that structures the webpage and includes the necessary CSS and JavaScript files.
2. data.js: Contains the input data in JSON format, including sentences and their tokenized keywords.
3. script.js: The JavaScript file that processes the data, builds the graph, and updates the sidebar with relevant information.


## How to Add Sentences and Keywords
Users can input sentences and their tokenized keywords into the data.js file. Each sentence and its corresponding keywords should be represented as a JSON object with the following format:

```
const data = [
    {
        "sentence": "Ghana is located in West Africa and is bordered by the Ivory Coast , Burkina Faso , and Togo .",
        "keywords": ["ghana", "locate", "west africa", "border", "ivory coast", "burkina faso", "togo"]
    },
    {
        "sentence": "Accra is the capital and largest city of Ghana .",
        "keywords": ["accra", "capital", "largest", "city", "ghana"]
    }
]
```

For a better visualization, perform following steps before saving the keywords:
 - Stop word removal
 - Keyword sanitization
 - Lemmatization, etc.

## Available Interactions
1. Keyword selection: Click on a node (keyword) in the graph to select it. The selected node will turn red, and its related links will become more visible.
2. Keyword deselection: Click on a selected node again to deselect it.
3. Sidebar keyword Buttons: Keywords selected from the graph are shown as buttons in the sidebar. Click the cross sign on the button to deselect the keyword.
4. Sidebar information: The sidebar shows the occurrence count of each selected keyword and the co-occurrence count if more than one keyword is selected.
5. Sentence pagination: The sidebar displays sentences containing the selected keywords with pagination controls at the bottom, allowing navigation through pages with 10 sentences per page.
