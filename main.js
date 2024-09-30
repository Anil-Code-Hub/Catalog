const fs = require('fs');
function readInput(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function extractPoints(data) {
    const n = data.keys.n; 
    const points = [];

    for (let i = 1; i <= n; i++) {
        if (data[i]) {
            const base = parseInt(data[i].base);
            const yValue = parseInt(data[i].value, base); 
            points.push({ x: i, y: yValue });
        }
    }

    return points;
}

function lagrangeInterpolation(points, xValue) {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term = term * (xValue - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }

    return result;
}
function findWrongPoints(points, expectedSecret) {
    const wrongPoints = [];
    points.forEach(point => {
        const computedY = lagrangeInterpolation(points, point.x);
        if (Math.round(computedY) !== point.y) {
            wrongPoints.push(point);
        }
    });
    return wrongPoints;
}

function processTestCase(file) {
    const data = readInput(file);  
    const points = extractPoints(data); 

    console.log(`Decoded points for ${file}:`, points);

    const secret = lagrangeInterpolation(points, 0);  
    console.log(`Secret (constant term c) for ${file}: ${Math.round(secret)}`);

    if (file === 'testcase2.json') {
        const wrongPoints = findWrongPoints(points, secret);
        console.log(`Wrong points in ${file}:`, wrongPoints);
    }
}

processTestCase('testcase1.json');
processTestCase('testcase2.json');
