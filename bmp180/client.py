import json
import threading

class Data(object):
    temp = 0
    pressure = 0
    height = 200

data = Data()
def update():
    data.temp = data.temp + 100
    data.pressure = 50
    data.height = data.height + 100
    serialize = json.dumps(data.__dict__)
    file = open("data.txt", "w")
    file.write(serialize)
    threading.Timer(1.0, update).start()

update()