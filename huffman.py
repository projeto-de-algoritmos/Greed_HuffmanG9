def get_frequencies(string, socketio):
    freq = {}
    for c in string:
        if c in freq:
            freq[c] += 1
        else:
            freq[c] = 1

    freq = sorted(freq.items(), key=lambda x: x[1])

    print(freq)

    socketio.emit('frequencies', {'frequencies': freq})

    return freq
