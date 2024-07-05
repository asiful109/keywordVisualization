# keyword visualization
This project visualizes a graph based on the frequency of keywords from a set of sentences. The graph highlights the relationships between keywords, and the sidebar provides detailed information about the selected keywords, their occurrence, and the sentences in which they appear.

## Files in the project
1. **index.html:** The main HTML file that structures the webpage and includes the necessary CSS and JavaScript files.
2. **data.js:** Contains the input data in JSON format, including sentences and their tokenized keywords.
3. **script.js:** The JavaScript file that processes the data, builds the graph, and updates the sidebar with relevant information.


## How to add sentences and keywords
Users can input sentences and their tokenized keywords into the data.js file. Each sentence and its corresponding keywords should be represented as a JSON object with the following format:

```
const data = [ {
  "sentence" : "Since then, many other operations have continued to target cattle traders as they return from Karamoja with cattle bought from the cattle markets.",
  "keywords" : [ {
    "type" : "lemma",
    "text" : "operation",
    "start" : 23,
    "stop" : 33
  }, {
    "type" : "lemma",
    "text" : "continue",
    "start" : 39,
    "stop" : 48
  }, {
    "type" : "lemma",
    "text" : "target",
    "start" : 52,
    "stop" : 58
  }, {
    "type" : "lemma",
    "text" : "cattle",
    "start" : 59,
    "stop" : 65
  }, {
    "type" : "lemma",
    "text" : "trader",
    "start" : 66,
    "stop" : 73
  }, {
    "type" : "lemma",
    "text" : "return",
    "start" : 82,
    "stop" : 88
  }, {
    "type" : "named entity",
    "text" : "karamoja",
    "start" : 94,
    "stop" : 102
  }, {
    "type" : "lemma",
    "text" : "cattle",
    "start" : 108,
    "stop" : 114
  }, {
    "type" : "lemma",
    "text" : "buy",
    "start" : 115,
    "stop" : 121
  }, {
    "type" : "lemma",
    "text" : "cattle",
    "start" : 131,
    "stop" : 137
  }, {
    "type" : "lemma",
    "text" : "market",
    "start" : 138,
    "stop" : 145
  } ]
},

{
    //Add the second sentence same way
}
];
```

For a better visualization, perform the following steps before saving the keywords:
 - Stop word removal
 - Keyword sanitization
 - Lemmatization, etc.

## Available interactions
1. **Keyword selection:** Click on a node (keyword) in the graph to select it. The selected node will turn red, and its related links will become more visible. When multiple nodes are selected, all edges between the selected nodes will turn orange.
2. **Keyword deselection:** Click on a selected node again to deselect it.
3. **Keyword Size and Link Width:** The size of each keyword in the graph is proportional to its frequency, with more frequent keywords appearing larger. Similarly, the width of the links between nodes is proportional to the number of sentences in which the connected keywords co-occur, with higher co-occurrence resulting in thicker links.
4. **Sidebar keyword Buttons:** Keywords selected from the graph are shown as buttons in the sidebar. Click the cross sign on the button to deselect the keyword.
5. **Sidebar information:** The sidebar shows the occurrence count of each selected keyword and the co-occurrence count if more than one keyword is selected.
6. **Sentence pagination:** The sidebar displays sentences containing the selected keywords with pagination controls at the bottom, allowing navigation through pages with 10 sentences per page.
