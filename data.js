const data = [
    {
        "sentence": "Ghana is located, in West Africa and is bordered by the Ivory Coast , Burkina Faso , and Togo .",
        "keywords": ["ghana", "locate", "west africa", "border", "ivory coast", "burkina faso", "togo"]
    },
    {
        "sentence": "Accra is the capital and largest city of Ghana .",
        "keywords": ["accra", "capital", "largest", "city", "ghana"]
    },
    {
        "sentence": "Ghana was the first African country to gain independence from colonial rule in 1957 .",
        "keywords": ["ghana", "first", "african", "country", "gain", "independence", "colonial", "rule", "1957"]
    },
    {
        "sentence": "The official language of Ghana is English .",
        "keywords": ["official", "language", "ghana", "english"]
    },
    {
        "sentence": "The Ghanaian currency is the Ghanaian cedi .",
        "keywords": ["ghanaian", "currency", "ghanaian", "cedi"]
    },
    {
        "sentence": "Ghana is known for its rich history and cultural heritage .",
        "keywords": ["ghana", "know", "rich", "history", "cultural", "heritage"]
    },
    {
        "sentence": "The country is a major producer of cocoa , being one of the top exporters in the world .",
        "keywords": ["country", "major", "producer", "cocoa", "one", "top", "exporter", "world"]
    },
    {
        "sentence": "Lake Volta in Ghana is one of the largest artificial lakes in the world .",
        "keywords": ["lake volta", "ghana", "one", "largest", "artificial", "lake", "world"]
    },
    {
        "sentence": "Ghana has a diverse range of wildlife and several national parks .",
        "keywords": ["ghana", "diverse", "range", "wildlife", "several", "national", "park"]
    },
    {
        "sentence": "The Ashanti Kingdom , a significant historical state , is located in Ghana .",
        "keywords": ["ashanti kingdom", "significant", "historical", "state", "locate", "ghana"]
    },
    {
        "sentence": "Kente cloth , a traditional Ghanaian textile , is famous for its bright colors and intricate patterns .",
        "keywords": ["kente", "cloth", "traditional", "ghanaian", "textile", "famous", "bright", "color", "intricate", "pattern"]
    },
    {
        "sentence": "Ghana 's economy is driven by resources like gold , oil , and cocoa .",
        "keywords": ["ghana", "economy", "drive", "resource", "like", "gold", "oil", "cocoa"]
    },
    {
        "sentence": "The country has a vibrant music scene , with genres like highlife and hiplife .",
        "keywords": ["country", "vibrant", "music", "scene", "genre", "like", "highlife", "hiplife"]
    },
    {
        "sentence": "Ghana has a multi-party political system and practices democracy .",
        "keywords": ["ghana", "multi-party", "political", "system", "practice", "democracy"]
    },
    {
        "sentence": "The University of Ghana is the oldest and largest of the thirteen Ghanaian public universities .",
        "keywords": ["university of ghana", "oldest", "largest", "thirteen", "ghanaian", "public", "university"]
    },
    {
        "sentence": "Ghanaian cuisine includes dishes like jollof rice , fufu , and banku .",
        "keywords": ["ghanaian", "cuisine", "include", "dish", "like", "jollof", "rice", "fufu", "banku"]
    },
    {
        "sentence": "The Akan people are the largest ethnic group in Ghana .",
        "keywords": ["akan", "people", "largest", "ethnic", "group", "ghana"]
    },
    {
        "sentence": "Ghana has a tropical climate with distinct rainy and dry seasons .",
        "keywords": ["ghana", "tropical", "climate", "distinct", "rainy", "dry", "season"]
    },
    {
        "sentence": "Ghanaian traditional festivals , such as the Homowo and Aboakyir festivals , attract many tourists .",
        "keywords": ["ghanaian", "traditional", "festival", "homowo", "aboakyir", "festival", "attract", "many", "tourist"]
    },
    {
        "sentence": "The country has been relatively politically stable compared to other nations in the region .",
        "keywords": ["country", "relatively", "politically", "stable", "compare", "nation", "region"]
    },
    {
        "sentence": "Joe Biden is the 46th president of the United States .",
        "keywords": ["joe biden", "46th", "president", "united states"]
    },
    {
        "sentence": "He was born on November 20 , 1942 , in Scranton , Pennsylvania .",
        "keywords": ["bear", "november 20 , 1942", "scranton", "pennsylvania"]
    },
    {
        "sentence": "Biden served as the vice president under Barack Obama from 2009 to 2017 .",
        "keywords": ["biden", "serve", "vice", "president", "barack obama", "2009", "2017"]
    },
    {
        "sentence": "Before becoming vice president , he represented Delaware in the U.S. Senate for 36 years .",
        "keywords": ["vice", "president", "represent", "delaware", "u.s. senate", "36 years"]
    },
    {
        "sentence": "Joe Biden is a member of the Democratic Party .",
        "keywords": ["joe biden", "member", "democratic party"]
    },
    {
        "sentence": "He attended the University of Delaware and Syracuse University College of Law .",
        "keywords": ["attend", "university of delaware", "syracuse university college of law"]
    },
    {
        "sentence": "Biden ran for president in 1988 and 2008 before winning in 2020 .",
        "keywords": ["biden", "run", "president", "1988", "2008", "win", "2020"]
    },
    {
        "sentence": "His 2020 campaign focused on issues like COVID-19 response , healthcare , and climate change .",
        "keywords": ["2020", "campaign", "focus", "issue", "like", "covid-19", "response", "healthcare", "climate", "change"]
    },
    {
        "sentence": "Joe Biden has faced personal tragedy , losing his first wife and daughter in a car accident in 1972 .",
        "keywords": ["joe biden", "face", "personal", "tragedy", "lose", "first", "wife", "daughter", "car", "accident", "1972"]
    },
    {
        "sentence": "His son , Beau Biden , died of brain cancer in 2015 .",
        "keywords": ["son", "beau biden", "die", "brain", "cancer", "2015"]
    },
    {
        "sentence": "Biden 's wife , Dr. Jill Biden , is an educator and the First Lady of the United States .",
        "keywords": ["biden", "wife", "dr", "jill biden", "educator", "first lady of the", "united states"]
    },
    {
        "sentence": "Joe Biden 's administration has prioritized infrastructure investment and economic recovery .",
        "keywords": ["joe biden", "administration", "prioritize", "infrastructure", "investment", "economic", "recovery"]
    },
    {
        "sentence": "He played a significant role in passing the Affordable Care Act during his vice presidency .",
        "keywords": ["play", "significant", "role", "pass", "affordable care act", "vice", "presidency"]
    },
    {
        "sentence": "Biden has been a strong advocate for LGBTQ + rights .",
        "keywords": ["biden", "strong", "advocate", "lgbtq", "+", "rights"]
    },
    {
        "sentence": "He has emphasized the importance of rebuilding alliances with international partners .",
        "keywords": ["emphasize", "importance", "rebuild", "alliance", "international", "partner"]
    },
    {
        "sentence": "Biden was a key figure in the passage of the 1994 Crime Bill .",
        "keywords": ["biden", "key", "figure", "passage", "1994", "crime bill"]
    },
    {
        "sentence": "He has worked to address issues related to racial inequality and police reform .",
        "keywords": ["work", "address", "issue", "relate", "racial", "inequality", "police", "reform"]
    },
    {
        "sentence": "Joe Biden 's 2020 victory marked the highest voter turnout in U.S. history .",
        "keywords": ["joe biden", "2020", "victory", "mark", "highest", "voter", "turnout", "u.s.", "history"]
    },
    {
        "sentence": "He has focused on expanding access to COVID-19 vaccines .",
        "keywords": ["focus", "expand", "access", "covid-19", "vaccine"]
    },
    {
        "sentence": "Biden 's presidency has faced challenges , including economic recovery and geopolitical tensions .",
        "keywords": ["biden", "presidency", "face", "challenge", "include", "economic", "recovery", "geopolitical", "tension"]
    },
    {
        "sentence": "The Olympic Games are an international sporting event featuring summer and winter sports competitions .",
        "keywords": ["olympic games", "international", "sport", "event", "feature", "summer", "winter", "sport", "competition"]
    },
    {
        "sentence": "The modern Olympics were founded by Pierre de Coubertin in 1896 .",
        "keywords": ["modern", "olympics", "found", "pierre de coubertin", "1896"]
    },
    {
        "sentence": "The Olympics are held every four years , with Summer and Winter Games alternating every two years .",
        "keywords": ["olympics", "hold", "four years", "summer", "winter", "games", "alternate", "two years"]
    },
    {
        "sentence": "The Olympic Games bring together athletes from over 200 nations .",
        "keywords": ["olympic games", "bring", "together", "athlete", "over", "200", "nation"]
    },
    {
        "sentence": "The Olympic rings symbolize the unity of the five inhabited continents .",
        "keywords": ["olympic", "ring", "symbolize", "unity", "five", "inhabit", "continent"]
    },
    {
        "sentence": "The first modern Olympic Games were held in Athens , Greece .",
        "keywords": ["first", "modern", "olympic games", "hold", "athens", "greece"]
    },
    {
        "sentence": "The Winter Olympics include sports like skiing , ice skating , and bobsledding .",
        "keywords": ["winter", "olympics", "include", "sport", "like", "ski", "ice", "skate", "bobsled"]
    },
    {
        "sentence": "The Summer Olympics feature events like swimming , athletics , and gymnastics .",
        "keywords": ["summer", "olympics", "feature", "event", "like", "swim", "athletics", "gymnastics"]
    },
    {
        "sentence": "The Olympic torch relay is a tradition that signifies the start of the Games .",
        "keywords": ["olympic", "torch", "relay", "tradition", "signify", "start", "games"]
    },
    {
        "sentence": "The International Olympic Committee ( IOC ) oversees the organization of the Games .",
        "keywords": ["international olympic committee", "ioc", "oversee", "organization", "games"]
    },
    {
        "sentence": "The 2020 Summer Olympics were postponed to 2021 due to the COVID-19 pandemic .",
        "keywords": ["2020 summer", "olympics", "postpone", "2021", "covid-19", "pandemic"]
    },
    {
        "sentence": "The Olympic motto is ' Citius , Altius , Fortius , ' which means ' Faster , Higher , Stronger .",
        "keywords": ["olympic", "motto", "citius", "altius", "fortius", "means", "faster", "higher", "stronger"]
    },
    {
        "sentence": "The Paralympic Games are held shortly after the Olympics for athletes with disabilities .",
        "keywords": ["paralympic games", "hold", "shortly", "olympics", "athlete", "disability"]
    },
    {
        "sentence": "The ancient Olympics were held in Olympia , Greece , from the 8th century BC to the 4th century AD .",
        "keywords": ["ancient", "olympics", "hold", "olympia", "greece", "8th", "century", "bc", "4th", "century", "ad"]
    },
    {
        "sentence": "Tokyo , Japan , hosted the Summer Olympics in 1964 and again in 2021 .",
        "keywords": ["tokyo", "japan", "host", "summer", "olympics", "1964", "2021"]
    },
    {
        "sentence": "The 2022 Winter Olympics were held in Beijing , China .",
        "keywords": ["2022 winter", "olympics", "hold", "beijing", "china"]
    },
    {
        "sentence": "Olympic medals are awarded in gold , silver , and bronze .",
        "keywords": ["olympic", "medal", "award", "gold", "silver", "bronze"]
    },
    {
        "sentence": "The Games aim to promote peace , unity , and fair competition among nations .",
        "keywords": ["games", "aim", "promote", "peace", "unity", "fair", "competition", "among", "nation"]
    },
    {
        "sentence": "The opening and closing ceremonies of the Olympics are grand spectacles showcasing the host nation 's culture .",
        "keywords": ["open", "close", "ceremony", "olympics", "grand", "spectacles", "showcase", "host", "nation", "culture"]
    },
    {
        "sentence": "Hosting the Olympics is considered a significant honor and opportunity for the host country to showcase itself to the world .",
        "keywords": ["host", "olympics", "consider", "significant", "honor", "opportunity", "host", "country", "showcase", "world"]
    }
];
