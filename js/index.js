var nodes = []
var edges = []
var network = {};
var vis_edges = {};
var vis_nodes = {};

const stepSpeed = 500;

function getNetworkOptions() {
    const options = {
        height: "700px",
        clickToUse: false,
        layout: {
            hierarchical: {
                direction: "UD",
                sortMethod: "directed",
                nodeSpacing: 250,
                levelSeparation: 300
            }
        },
        interaction: { dragNodes: false, zoomView: false },
        physics: {
            enabled: false
        },
        nodes: {
            heightConstraint: {
                minimum: 30
            },
            font: {
                size: 48
            }
        },
        edges: {
            font: {
                size: 48
            }
        }
    };
    return options;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solve() {
    const word = document.getElementById('start').value;
    const frequencies = getFrequencies(word);
    const codes = await createTree(frequencies);
    printEncoded(codes, word);
}

function getFrequencies(string) {
    let freq = {}

    for (let c of string) {
        if (c in freq) {
            freq[c] += 1
        } else {
            freq[c] = 1
        }
    }

    let items = Object.keys(freq).map((key) => {
        return [key, freq[key]];
    })

    items.sort((first, second) => {
        return first[1] - second[1];
    })

    return items
}

function initCodes(frequencies, nodes) {
    let codes = {};
    for (let i = 0; i < frequencies.length; i++) {
        codes[frequencies[i][0]] = '';

        nodes.push({
            id: frequencies[i][0],
            label: `${frequencies[i][0]}`,
        })
    }
    return codes;
}

function updateCode(node, codes, code) {
    for (i = 0; i < node[0].length; i++) {
        let char = node[0].charAt(i);
        codes[char] += code;
    }
}

async function createTree(frequencies) {
    clearOutput();

    nodes = [];
    edges = [];
    let codes = initCodes(frequencies, nodes);
    console.log({...codes});


    vis_nodes = new vis.DataSet(nodes);
    vis_edges = new vis.DataSet(edges);

    var container = document.getElementById('mynetwork');
    var data = {
        nodes: vis_nodes,
        edges: vis_edges
    };

    var options = getNetworkOptions();
    network = new vis.Network(container, data, options);

    await sleep(stepSpeed);

    while (frequencies.length > 1) {

        let node1 = frequencies[0];
        let node2 = frequencies[1];

        let parent_node = {
            id: frequencies[0][0] + frequencies[1][0],
            label: (frequencies[0][1] + frequencies[1][1]).toString()
        };

        frequencies.push([node1[0] + node2[0], node1[1] + node2[1]])
        nodes.push(parent_node)

        frequencies.splice(0, 2);

        edges.push({
            from: parent_node.id,
            to: node1[0],
            label: '0'
        });

        edges.push({
            from: parent_node.id,
            to: node2[0],
            label: '1'
        });

        updateCode(node1, codes, '0');
        updateCode(node2, codes, '1');

        let data_nodes = new vis.DataSet(nodes);
        let data_edges = new vis.DataSet(edges);

        network.setData({ nodes: data_nodes, edges: data_edges });
        network.redraw();
        frequencies.sort((a, b) => {
            if (a[1] < b[1]) return -1;
            if (a[1] > b[1]) return 1;
            return 0;
        })
        await sleep(stepSpeed);
    }
    generateCodesTable(codes);

    return codes;
}

function clearTable() {
    
}

function clearOutput() {
    let table = document.getElementsByTagName('table');
    let encodedText = document.getElementById('msg');

    if (table.length) {
        table[0].parentNode.removeChild(table[0])
    }

    encodedText.textContent = '';
}

function generateCodesTable(codes) {
    clearOutput();

    let keys = Object.keys(codes);

    const body = document.getElementById('div-table');
    table = document.createElement('table');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const headerLetter = document.createElement('th');
    headerLetter.innerHTML = "Letra";

    const headerCode = document.createElement('th');
    headerCode.innerHTML = "Código";

    headerRow.appendChild(headerLetter)
    headerRow.appendChild(headerCode)

    tbody.appendChild(headerRow)

    for (let i = 0; i < keys.length; i++) {
        const tr = document.createElement('tr');
        const letterTd = document.createElement('td');

        letterTd.innerHTML = keys[i];

        const codeTd = document.createElement('td');
        codeTd.innerHTML = [...codes[keys[i]]].reverse().join("");

        tr.appendChild(letterTd);
        tr.appendChild(codeTd);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    body.appendChild(table);
}

function printEncoded(codesTable, string) {
    let output = '';

    for (let c of string) {
        output += [...codesTable[c]].reverse().join("");
    }

    const text = document.getElementById('msg')
    text.textContent = `Frase codificada: ${output}`
    console.log(output);
}