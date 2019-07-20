queue()
    .defer(d3.csv, "data/sunny/Energie_en_vermogen_Alle_Dagen.csv")
    .await(makeGraphs);

function makeGraphs(err, producePowerData) {

}


