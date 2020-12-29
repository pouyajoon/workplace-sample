const defaultItemTypeRatio = 1 / 0.025;

const room = {
    "id": 10548,
    "name": "B-02-37i",
    "room_type_id": 9,
    "floor_id": 114,
    "points": "[{\"x\":2385.840576171875,\"y\":2221.446533203125},{\"x\":2604.172607421875,\"y\":2221.446533203125},{\"x\":2604.172607421875,\"y\":2211.672607421875},{\"x\":2623.855224609375,\"y\":2211.672607421875},{\"x\":2623.855224609375,\"y\":2225.450439453125},{\"x\":2689.299072265625,\"y\":2225.450439453125},{\"x\":2689.897705078125,\"y\":1774.2655029296875},{\"x\":2555.417724609375,\"y\":1774.2655029296875},{\"x\":2555.417724609375,\"y\":1667.7734375},{\"x\":2507.8125,\"y\":1623.0799560546875},{\"x\":2385.997314453125,\"y\":1623.0799560546875}]",
};

const item1 = {
    "id": 71795,
    "x": 2423.0,
    "y": 1761.0,
    "room_id": 10548,
    "item_type_id": 111,
    "rotation": 0.0,
    "display_name": "H",
    "physical_id": "P387",
    "color": "#ffff00",
    "item_type": {
        "id": 111,
        "name": "PdT 160x80",
        "code": "AA",
        "color": "#ffff00",
        "shape": [{
            "x": 0.027403654530644417,
            "y": 0.016557814553380013
        }, {
            "x": 64.00225067138672,
            "y": 0
        }, {
            "x": 63.881771087646484,
            "y": 32.04963123984635
        }, {
            "x": 32.03912353515625,
            "y": 31.88167774863541
        }, {
            "x": 43.91364669799805,
            "y": 34.47381794638932
        }, {
            "x": 44.0840950012207,
            "y": 58.27523625083268
        }, {
            "x": 20.2352294921875,
            "y": 58.28910649009049
        }, {
            "x": 20.132078170776367,
            "y": 34.12319767661393
        }, {
            "x": 32.06731414794922,
            "y": 31.89048588462174
        }, {
            "x": 0,
            "y": 31.882087828591466
        }]
    }
}

const item2 = {
    "id": 71787,
    "x": 2423.0,
    "y": 1708.0,
    "room_id": 10548,
    "item_quality_id": null,
    "purchase_date": null,
    "immo_code": "A/D",
    "item_type_id": 180,
    "rotation": 180.4572595741628,
    "external_id": null,
    "display_name": "I",
    "physical_id": "P388",
    "is_flex": false,
    "color": "#ff8040",
    "item_type": {
        "id": 180,
        "name": "Pdt 160x80 A/D",
        "code": "AA",
        "price": null,
        "color": "#ff8040",
        "shape": [{
            "x": 0,
            "y": 0.3195514678955078
        }, {
            "x": 63.84716796875,
            "y": 0
        }, {
            "x": 64.1332778930664,
            "y": 32.17681121826172
        }, {
            "x": 32.31993103027344,
            "y": 32.167877197265625
        }, {
            "x": 44.17586135864258,
            "y": 34.3560676574707
        }, {
            "x": 44.4832763671875,
            "y": 58.39840316772461
        }, {
            "x": 20.534412384033203,
            "y": 58.336090087890625
        }, {
            "x": 20.381698608398438,
            "y": 34.239253997802734
        }, {
            "x": 32.301658630371094,
            "y": 32.161590576171875
        }, {
            "x": 0.2004718780517578,
            "y": 32.377288818359375
        }],
        "area": 1.66,
        "perimeter": 7.2,
        "icon": "",
        "display_information_on_map": true,
        "item_type_workspace": true,
        "height": 1.0,
        "external_id": "",
        "display_items_on_map": true,
        "zindex": 1,
        "item_type_family_id": null
    }
}
const floor = {
    "id": 114,
    "name": "R+2",
    "building_id": 27,
    "map_scale_x1": 814,
    "map_scale_y1": 466,
    "map_scale_x2": 1270,
    "map_scale_y2": 467,
    "map_scale_length": 10.0
}

function addPolygon(points) {
    const svg = document.getElementById('svg');
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    svg.appendChild(polygon);
    for (value of points) {
        var point = svg.createSVGPoint();
        const { x, y } = value;
        point.x = x;
        point.y = y;
        polygon.points.appendItem(point);
    }
    return polygon;
}


function displayItem(item, mapRatio) {
    const { item_type, x, y } = item;
    const points = item_type.shape;

    const rotation = importRound(item.rotation < 0 ? item.rotation + 360 : item.rotation);
    const position = getNewItemCenterFromLegacy(mapRatio, { x, y }, rotation, points);

    const itemPoints = translatedAndRotatedPoints(points, mapRatio, position, rotation, getMiddleFromPoints);
    const itemPolygon = addPolygon(itemPoints);
    itemPolygon.setAttribute('fill', 'red');

}

function init() {

    // calculer le map ratio
    const { map_scale_x1, map_scale_x2, map_scale_y1, map_scale_y2, map_scale_length } = floor;
    const mapRatio = map_scale_length / lineDistance({ x: map_scale_x1, y: map_scale_y1 }, { x: map_scale_x2, y: map_scale_y2 });

    displayItem(item1, mapRatio);
    displayItem(item2, mapRatio);

    const roomPoints = JSON.parse(room.points);
    const roomPolygon = addPolygon(roomPoints);
    roomPolygon.setAttribute('stroke', 'blue');
    roomPolygon.setAttribute('fill', 'transparent');

}


init();

function lineDistance(point1, point2) {
    let xs = point2.x - point1.x;
    xs = xs * xs;
    let ys = point2.y - point1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
}



function rotateItemsPoints(middle, points, rotation) {
    return points.map(p => {
        const point = p;
        const rotated = rotatePoint(middle, point, rotation || 0);
        return {
            ...p,
            ...rotated
        };
    });
}

function rotate(cx, cy, x, y, angle) {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
}

function rotatePoint(center, point, angle) {
    const { x: cx, y: cy } = center;
    const { x, y } = point;
    return rotate(cx, cy, x, y, angle);
}

function translatePoints(points, globalTranslate, localTranslate, ratio) {
    const { x, y } = globalTranslate;
    return points.map(p => {
        const point = {
            x: x + (p.x - localTranslate.x) * ratio,
            y: y + (p.y - localTranslate.y) * ratio
        };
        return {
            ...p,
            ...point
        };
    });
}

function getItemMapRatio(mapRatio) {
    return (1 / mapRatio) / defaultItemTypeRatio;
}

function translatedAndRotatedPoints(points, mapRatio, position, rotation, getCenter) {
    const ratio = getItemMapRatio(mapRatio);
    const middle = getCenter(points);
    if (rotation !== 0) {
        points = rotateItemsPoints(middle, points, rotation);
    }
    points = translatePoints(points, position, middle, ratio);
    return points;
}

function getMiddleFromPoints(points) {
    const bounds = getBoundsFromPoints(points);
    const { middle } = getBoundaryBoxFromBounds(bounds);
    return middle;
}

function getBoundsFromPoints(points) {
    if (points.length === 0) {
        return { top: 0, left: 0, right: 0, bottom: 0 };
    }
    return points.reduce(
        (acc, v) => {
            const { top, right, bottom, left } = acc;
            return {
                top: Math.min(top, v.y),
                right: Math.max(right, v.x),
                bottom: Math.max(bottom, v.y),
                left: Math.min(left, v.x)
            };
        },
        {
            top: 1e8, right: 0, bottom: 0, left: 1e8
        });
}

function getBoundaryBoxFromBounds(b) {
    const size = {
        width: b.right - b.left,
        height: b.bottom - b.top
    };
    return {
        ...b,
        size,
        middle: {
            x: b.left + size.width / 2,
            y: b.top + size.height / 2
        }
    };
}

function getOldCenterForPoints(points) {
    const nPts = points.length;
    let x = 0;
    let y = 0;
    let f;
    let j = nPts - 1;
    let p1;
    let p2;

    for (let i = 0; i < nPts; j = i++) {
        p1 = points[i];
        p2 = points[j];
        f = p1.x * p2.y - p2.x * p1.y;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
    }

    f = oldArea(points) * 6;
    return {
        x: x / f,
        y: y / f
    };
}
function getNewItemCenterFromLegacy(mapRatio, position, rotation, itemTypePoints) {
    let { x, y } = position;
    const oldPoints = translatedAndRotatedPoints(itemTypePoints, mapRatio, position, rotation, getOldCenterForPoints);
    const nPoints = translatedAndRotatedPoints(itemTypePoints, mapRatio, position, rotation, getMiddleFromPoints);
    const oldCenter = getOldCenterForPoints(oldPoints);
    const oldFashionCenterFromNewPoints = getOldCenterForPoints(nPoints);
    const diff = {
        x: (oldCenter.x - oldFashionCenterFromNewPoints.x),
        y: (oldCenter.y - oldFashionCenterFromNewPoints.y)
    };
    x = importRound(x + diff.x);
    y = importRound(y + diff.y);

    return { x, y };
}

function oldArea(pts) {
    let area = 0;
    const nPts = pts.length;
    let j = nPts - 1;
    let p1;
    let p2;

    for (let i = 0; i < nPts; j = i++) {
        p1 = pts[i];
        p2 = pts[j];
        area += p1.x * p2.y;
        area -= p1.y * p2.x;
    }
    area /= 2;
    return area;
}

function round(v, decimal) {
    const d = Math.pow(10, decimal);
    return Math.round(v * d) / d;
}

function importRound(v) {
    return round(v, 10);
}