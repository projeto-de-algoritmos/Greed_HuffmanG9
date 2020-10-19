import heapq
# Huffman Coding in python

# Creating tree nodes
class NodeTree(object):

    def __init__(self, left=None, right=None):
        self.left = left
        self.right = right

    def children(self):
        return (self.left, self.right)

    def nodes(self):
        return (self.left, self.right)

    # def __str__(self, level=0):
    #     ret = "\t"*level+repr(self.value)+"\n"
    #     for child in self.children():
    #         ret += child.__str__(level+1)
    #     return ret

    def print_tree(self):
        if type(self.left) is str:
            print('=======LEFT=============')
            print(self.left)
        else: 
            self.left.print_tree()

        if type(self.right) is str:
            print('========RIGHT===========')
            print(self.right)
        else: 
            self.right.print_tree()

# Main function implementing huffman coding
def huffman_code_tree(node, left=True, binString=''):
    if type(node) is str:
        return {node: binString}
    (l, r) = node.children()
    d = dict()
    d.update(huffman_code_tree(l, True, binString + '0'))
    d.update(huffman_code_tree(r, False, binString + '1'))
    return d


def get_frequencies(string):
    freq = {}
    for c in string:
        if c in freq:
            freq[c] += 1
        else:
            freq[c] = 1

    freq = sorted(freq.items(), key=lambda x: x[1], reverse=True)

    return freq


def solve(string, socketio):
    nodes = get_frequencies(string)
    heap = [[weight, [symbol, weight, '']] for symbol, weight in nodes]
    heapq.heapify(heap)

    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]:
            pair[2] = '0' + pair[2]
        for pair in hi[1:]:
            pair[2] = '1' + pair[2]

        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
        socketio.emit('update', {'nodes': heap})

    return sorted(heapq.heappop(heap)[1:], key=lambda p: (len(p[-1]), p))

# def solve(string, socketio):
    

    # emit_data = []
    # for frequency in frequencies:
    #     emit_data.append({
    #         'letter': frequency[0],
    #         'frequency': frequency[1],
    #     })
    # socketio.emit('update', {'nodes': emit_data})

    # nodes = encode(frequencies)
    # print(nodes)
    # huffmanCode = huffman_code_tree(nodes[0][0])

    # nodes[0][0].print_tree()
    # print(' Char | Huffman code ')
    # print('----------------------')
    # for (char, frequency) in frequencies:
    #     print(' %-4r |%12s' % (char, huffmanCode[char]))