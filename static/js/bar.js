const url = "/data";

d3.json(url).then(function (response) {
    console.log(response);

    // Extracting `income_level`, `suicide_rate`, and `homicide_rate` from the response
    var xData = response.features.map(item => item.properties.income_level);
    var ySuicideData = response.features.map(item => item.properties.suicide_rate);
    var yHomicideData = response.features.map(item => item.properties.homicide_rate);

    // Calculate the average suicide rate and average homicide rate for each income level
    var averageRatesByIncomeLevel = xData.reduce((acc, income, index) => {
        if (!acc.hasOwnProperty(income)) {
            acc[income] = { suicideSum: 0, suicideCount: 0, homicideSum: 0, homicideCount: 0 };
        }
        acc[income].suicideSum += ySuicideData[index];
        acc[income].suicideCount++;
        acc[income].homicideSum += yHomicideData[index];
        acc[income].homicideCount++;
        return acc;
    }, {});

    // Calculate the final average for each income level
    for (var income in averageRatesByIncomeLevel) {
        averageRatesByIncomeLevel[income].averageSuicideRate =
            averageRatesByIncomeLevel[income].suicideSum / averageRatesByIncomeLevel[income].suicideCount;
        averageRatesByIncomeLevel[income].averageHomicideRate =
            averageRatesByIncomeLevel[income].homicideSum / averageRatesByIncomeLevel[income].homicideCount;
    }

    console.log("Average Suicide and Homicide Rates by Income Level:", averageRatesByIncomeLevel);

    // Creating the Plotly trace for suicide rates
    var traceSuicide = {
        x: Object.keys(averageRatesByIncomeLevel), // Income levels
        y: Object.values(averageRatesByIncomeLevel).map(item => item.averageSuicideRate), // Average suicide rates
        name: 'Average Suicide Rate',
        type: 'bar'
    };

    // Creating the Plotly trace for homicide rates
    var traceHomicide = {
        x: Object.keys(averageRatesByIncomeLevel), // Income levels
        y: Object.values(averageRatesByIncomeLevel).map(item => item.averageHomicideRate), // Average homicide rates
        name: 'Average Homicide Rate',
        type: 'bar'
    };

    // Creating the Plotly chart with multiple bars
    var data = [traceSuicide, traceHomicide];
    var layout = {
        barmode: 'group', // Set the barmode to 'group' for multi-bar chart
        title: 'Average Suicide and Homicide Rates by Income Level',
        xaxis: {
            title: 'Average Income Level'
        },
        yaxis: {
            title: 'Rate Per 100k'
        }
    };

    Plotly.newPlot('myDiv', data, layout);
});
