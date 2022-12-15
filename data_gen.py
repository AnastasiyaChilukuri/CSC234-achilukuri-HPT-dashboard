from math import log
import random
import json

#list to keep track of unique serial numbers
motor_sno   = []
battery_sno = []
tool_sno    = []

#maps a date(year-month) to shippment ID
date_to_sea_shippment_id = {}
date_to_land_shippment_id = {}

#Data to be stored in final tables
tool_data           = []
motor_data          = []
battery_data        = []
sea_shipment_data   = []
land_shipment_data  = []
sea_route           = []
land_route          = []

_tool_types = ["hammerDrillBulldog",
 "percussionDrill",
 "mixerDrill",
 "compactDrill",
 "rotaryDrill",
 "angleDrill",
 "hammerDrill"]

_tool_types_acronym = {"hammerDrillBulldog" : "HDB",
 "percussionDrill" : "PD",
 "mixerDrill" : "MD",
 "compactDrill" : "CD",
 "rotaryDrill" : "RD",
 "angleDrill" : "AD",
 "hammerDrill" : "HD"}

_shipment_types = ["sea", "land"]

def get_n_months_before_date(input_date, n):
    year, month, day = str(input_date).split('-')
    year = int(year)
    month = int(month)
    day = int(day)
    if month-n <= 0:
        year = year - 1
        month = 12 - (n-month)
    else:
        month = month-n
    return str(year) + "-" + "%02d"%month + "-" + "%02d"%day

def gen_shippment_id():
    for year in range(2012, 2023):
        for month in ["%02d" % x  for x in range(1, 13)]:
            for _shipment_type in _shipment_types:
                tracking_number = _shipment_type + str(year) + str(month)
                labour_cost = random.randint(35, 100)
                vid = ("SH" if (_shipment_type == "sea") else  "TR") + str(random.randint(1,13))
                routeId = _shipment_type.lower()+str(random.randint(1,10))
                if _shipment_type == "sea":
                    shippment = {
                        "trackingNumber" : tracking_number,
                        "labourCost" : str(labour_cost),
                        "shipID" : vid,
                        "seaRouteID" : routeId
                    }
                    sea_shipment_data.append(shippment)
                    date_to_sea_shippment_id[str(year)+"-"+str(month)] = tracking_number
                else:
                    shippment = {
                        "trackingNumber" : tracking_number,
                        "labourCost" : str(labour_cost),
                        "truckID" : vid,
                        "landRouteID" : routeId
                    }
                    land_shipment_data.append(shippment)
                    date_to_land_shippment_id[str(year)+"-"+str(month)] = tracking_number

def gen_sea_and_land_route():
    for _shipment_type in _shipment_types:
        for id in range(1, 11):
            route_id = _shipment_type.lower() + str(id)
            fuel_cost = random.randint(10,50)
            co2 = round(fuel_cost * 0.2, 2)
            if _shipment_type == "sea":
                sea_route.append({"routeID" : route_id, "fuelCost" : str(fuel_cost), "co2" : str(co2)})
            else:
                land_route.append({"routeID" : route_id, "fuelCost" : str(fuel_cost), "co2" : str(co2)})

def gen_motor_sn(tool_type, tool_manf_date):
    global motor_data
    motor = {}
    motor_part_number = tool_type + "Motor"
    motor_manf_date = get_n_months_before_date(tool_manf_date, 2)
    year = int(motor_manf_date.split('-')[0])
    month = motor_manf_date.split('-')[1]

    motor_sn = tool_type +"M"+ str(year) + str(month) + str(random.randint(100,1000))
    while motor_sn in motor_sno:
        motor_sn = tool_type +"M"+ str(year) + str(month) + str(random.randint(100,1000))
    motor_sno.append(motor_sn)

    co2 = round(log(2025-year) * random.uniform(6.0,10.0), 2)
    cost_manf = round(log(year-2006),2) * 25
    sales_price = cost_manf + (cost_manf * 0.15) #15% higher than manufacturing
    shipment_type = _shipment_types[random.randint(0,1)]
    shipment_id = date_to_sea_shippment_id[str(year)+"-"+month] if shipment_type == "sea" else date_to_land_shippment_id[str(year)+"-"+month]
    motor["partNumber"] = motor_part_number
    motor["serialNumber"] = motor_sn
    motor["co2"] =  str(co2)
    motor["dateManufactured"] = motor_manf_date
    motor["costManufactured"] = str(cost_manf)
    motor["salesPrice"] = str(sales_price)
    motor["shipmentType"] = shipment_type.lower()
    motor["shipmentID"] = shipment_id

    motor_data.append(motor)
    return motor_sn

def gen_battery_sn(tool_type, tool_manf_date):
    global battery_data
    battery = {}
    battery_part_number = tool_type + "Battery"
    battery_manf_date = get_n_months_before_date(tool_manf_date, 3)
    year = int(battery_manf_date.split('-')[0])
    month = battery_manf_date.split('-')[1]

    battery_sn = tool_type +"B"+ str(year) + str(month) + str(random.randint(100,1000))
    while battery_sn in battery_sno:
        battery_sn = tool_type +"B"+ str(year) + str(month) + str(random.randint(100,1000))
    battery_sno.append(battery_sn)

    co2 = round(log(2025-year) * random.uniform(6.0,10.0), 2)
    cost_manf = round(log(year-2005),2) * 25
    sales_price = cost_manf + (cost_manf * 0.15) #15% higher than manufacturing
    shipment_type = _shipment_types[random.randint(0,1)]
    shipment_type = _shipment_types[random.randint(0,1)]
    shipment_id = date_to_sea_shippment_id[str(year)+"-"+month] if shipment_type == "sea" else date_to_land_shippment_id[str(year)+"-"+month]
    battery["partNumber"] = battery_part_number
    battery["serialNumber"] = battery_sn
    battery["co2"] =  str(co2)
    battery["dateManufactured"] = battery_manf_date
    battery["costManufactured"] = str(cost_manf)
    battery["salesPrice"] = str(sales_price)
    battery["shipmentType"] = shipment_type
    battery["shipmentID"] = shipment_id

    battery_data.append(battery)
    return battery_sn

def gen_tool_data(tool_types):
    global tool_data
    for year in range(2013, 2023):
        for month in ["%02d" % x  for x in range(1, 13)]:
            for ttype in tool_types:
                tool = {}
                tool_serialNumber = _tool_types_acronym[ttype] + str(year) + str(month) + str(random.randint(100,1000))
                while tool_serialNumber in tool_sno:
                    tool_serialNumber = _tool_types_acronym[ttype] + str(year) + str(month) + str(random.randint(100,1000))
                tool_sno.append(tool_serialNumber)
                tool['serialNumber'] = tool_serialNumber
                tool['toolType'] = ttype
                tool['releaseDate'] = str(year) + "-" + str(month) + "-01"
                tool['motorSN'] = gen_motor_sn(_tool_types_acronym[ttype], tool['releaseDate'])
                tool['batterySN'] = gen_battery_sn(_tool_types_acronym[ttype], tool['releaseDate'])
                tool_data.append(tool)


if __name__ == '__main__':
    gen_shippment_id()
    gen_sea_and_land_route()
    gen_tool_data(_tool_types)
    entire_data = {}
    entire_data['tool'] = tool_data
    entire_data['motor'] = motor_data
    entire_data['battery'] = battery_data
    entire_data['seashipment'] = sea_shipment_data
    entire_data['landshipment'] = land_shipment_data
    entire_data['searoute'] = sea_route
    entire_data['landroute'] = land_route
    print(len(tool_data))
    print(len(motor_data))
    print(len(battery_data))
    print(len(sea_shipment_data))
    print(len(land_shipment_data))
    print(len(sea_route))
    print(len(land_route))

    with open("export_to_vendia.json", "w") as outfile:
        json.dump(entire_data, outfile)