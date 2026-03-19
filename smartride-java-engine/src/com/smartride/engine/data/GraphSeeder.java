package com.smartride.engine.data;

import com.smartride.engine.graph.CityGraph;

/**
 * GraphSeeder - Loads the city road graph into memory.
 * WHY hardcoded? In production, this would come from OpenStreetMap or
 * a JSON file. For an interview project, hardcoded data demonstrates
 * the graph structure clearly.
 *
 * Graph: 40 nodes (Pune city landmarks), 55+ weighted edges (roads in km)
 */
public class GraphSeeder {

    public static CityGraph buildCityGraph() {
        CityGraph graph = new CityGraph();

        // == NODES: City landmarks with [latitude, longitude] ==

        // Central
        graph.addNode("N1_ShivajiNagar",      18.5308, 73.8475);
        graph.addNode("N2_DeccanGymkhana",     18.5196, 73.8411);
        graph.addNode("N3_FCRoad",             18.5272, 73.8400);
        graph.addNode("N4_JMRoad",             18.5205, 73.8370);
        graph.addNode("N5_SwagatSquare",       18.5165, 73.8558);

        // East
        graph.addNode("N6_Koregaon",           18.5362, 73.8938);
        graph.addNode("N7_Kalyani",            18.5074, 73.9065);
        graph.addNode("N8_Viman",              18.5679, 73.9143);
        graph.addNode("N9_Kharadi",            18.5523, 73.9372);
        graph.addNode("N10_Hadapsar",          18.5089, 73.9260);

        // West
        graph.addNode("N11_Kothrud",           18.5074, 73.8077);
        graph.addNode("N12_Warje",             18.4832, 73.8050);
        graph.addNode("N13_Bavdhan",           18.5127, 73.7789);
        graph.addNode("N14_Hinjewadi",         18.5912, 73.7380);
        graph.addNode("N15_Balewadi",          18.5720, 73.7712);

        // North
        graph.addNode("N16_AundhIT",           18.5588, 73.8073);
        graph.addNode("N17_PimpriChinchwad",   18.6279, 73.8009);
        graph.addNode("N18_Wakad",             18.5989, 73.7645);
        graph.addNode("N19_Baner",             18.5590, 73.7868);
        graph.addNode("N20_Pashan",            18.5352, 73.7989);

        // South
        graph.addNode("N21_Sinhagad",          18.4790, 73.8430);
        graph.addNode("N22_Katraj",            18.4537, 73.8578);
        graph.addNode("N23_Bibvewadi",         18.4795, 73.8660);
        graph.addNode("N24_Kondhwa",           18.4700, 73.8900);
        graph.addNode("N25_NIBM",              18.4630, 73.9080);

        // IT Hub
        graph.addNode("N26_Magarpatta",        18.5150, 73.9270);
        graph.addNode("N27_PhoenixMall",       18.5600, 73.9155);
        graph.addNode("N28_EON_IT",            18.5530, 73.9400);

        // Transit
        graph.addNode("N29_Airport",           18.5822, 73.9197);
        graph.addNode("N30_PuneStation",       18.5285, 73.8742);

        // Outskirts
        graph.addNode("N31_Lonavala",          18.7557, 73.4091);
        graph.addNode("N32_Talegaon",          18.7340, 73.6755);
        graph.addNode("N33_Chakan",            18.7600, 73.8620);
        graph.addNode("N34_Wagholi",           18.5820, 73.9720);
        graph.addNode("N35_Undri",             18.4475, 73.9150);

        // Detail
        graph.addNode("N36_SB_Road",           18.5120, 73.8310);
        graph.addNode("N37_LawCollege",        18.5130, 73.8380);
        graph.addNode("N38_ModelColony",       18.5255, 73.8338);
        graph.addNode("N39_Camp",              18.5120, 73.8780);
        graph.addNode("N40_MG_Road",           18.5150, 73.8750);

        // == EDGES: Roads with distances in km ==

        // Central Ring
        graph.addEdge("N1_ShivajiNagar",    "N3_FCRoad",           0.9);
        graph.addEdge("N1_ShivajiNagar",    "N5_SwagatSquare",     1.5);
        graph.addEdge("N1_ShivajiNagar",    "N30_PuneStation",     2.0);
        graph.addEdge("N2_DeccanGymkhana",  "N3_FCRoad",           0.7);
        graph.addEdge("N2_DeccanGymkhana",  "N4_JMRoad",           0.5);
        graph.addEdge("N2_DeccanGymkhana",  "N37_LawCollege",      0.8);
        graph.addEdge("N3_FCRoad",          "N38_ModelColony",     0.6);
        graph.addEdge("N4_JMRoad",          "N36_SB_Road",         0.7);
        graph.addEdge("N4_JMRoad",          "N37_LawCollege",      0.4);
        graph.addEdge("N5_SwagatSquare",    "N30_PuneStation",     1.8);
        graph.addEdge("N5_SwagatSquare",    "N39_Camp",            2.0);

        // East Corridor
        graph.addEdge("N6_Koregaon",        "N30_PuneStation",     3.2);
        graph.addEdge("N6_Koregaon",        "N27_PhoenixMall",     2.5);
        graph.addEdge("N6_Koregaon",        "N39_Camp",            3.0);
        graph.addEdge("N7_Kalyani",         "N10_Hadapsar",        2.2);
        graph.addEdge("N7_Kalyani",         "N26_Magarpatta",      2.5);
        graph.addEdge("N8_Viman",           "N29_Airport",         2.0);
        graph.addEdge("N8_Viman",           "N27_PhoenixMall",     1.8);
        graph.addEdge("N8_Viman",           "N9_Kharadi",          3.5);
        graph.addEdge("N9_Kharadi",         "N28_EON_IT",          1.2);
        graph.addEdge("N9_Kharadi",         "N34_Wagholi",         4.5);
        graph.addEdge("N10_Hadapsar",       "N26_Magarpatta",      1.5);
        graph.addEdge("N10_Hadapsar",       "N25_NIBM",            3.8);

        // West Corridor
        graph.addEdge("N11_Kothrud",        "N36_SB_Road",         2.0);
        graph.addEdge("N11_Kothrud",        "N12_Warje",           2.8);
        graph.addEdge("N11_Kothrud",        "N20_Pashan",          2.5);
        graph.addEdge("N12_Warje",          "N13_Bavdhan",         3.5);
        graph.addEdge("N12_Warje",          "N21_Sinhagad",        3.0);
        graph.addEdge("N13_Bavdhan",        "N15_Balewadi",        3.0);
        graph.addEdge("N13_Bavdhan",        "N19_Baner",           2.8);
        graph.addEdge("N14_Hinjewadi",      "N18_Wakad",           3.5);
        graph.addEdge("N14_Hinjewadi",      "N15_Balewadi",        4.2);
        graph.addEdge("N15_Balewadi",       "N19_Baner",           1.5);

        // North Corridor
        graph.addEdge("N16_AundhIT",        "N19_Baner",           2.0);
        graph.addEdge("N16_AundhIT",        "N20_Pashan",          2.2);
        graph.addEdge("N16_AundhIT",        "N38_ModelColony",     3.5);
        graph.addEdge("N17_PimpriChinchwad", "N18_Wakad",          3.8);
        graph.addEdge("N17_PimpriChinchwad", "N33_Chakan",         8.0);
        graph.addEdge("N18_Wakad",          "N19_Baner",           3.2);
        graph.addEdge("N20_Pashan",         "N38_ModelColony",     1.8);

        // South Corridor
        graph.addEdge("N21_Sinhagad",       "N22_Katraj",          3.5);
        graph.addEdge("N21_Sinhagad",       "N23_Bibvewadi",       2.5);
        graph.addEdge("N22_Katraj",         "N23_Bibvewadi",       2.0);
        graph.addEdge("N23_Bibvewadi",      "N40_MG_Road",         3.0);
        graph.addEdge("N24_Kondhwa",        "N25_NIBM",            2.5);
        graph.addEdge("N24_Kondhwa",        "N23_Bibvewadi",       2.8);
        graph.addEdge("N24_Kondhwa",        "N35_Undri",           3.5);

        // Cross Links
        graph.addEdge("N30_PuneStation",    "N40_MG_Road",         1.5);
        graph.addEdge("N39_Camp",           "N40_MG_Road",         1.0);
        graph.addEdge("N40_MG_Road",        "N10_Hadapsar",        5.5);
        graph.addEdge("N36_SB_Road",        "N37_LawCollege",      0.5);
        graph.addEdge("N27_PhoenixMall",    "N28_EON_IT",          3.0);
        graph.addEdge("N27_PhoenixMall",    "N29_Airport",         3.5);
        graph.addEdge("N29_Airport",        "N34_Wagholi",         6.0);

        // Highway
        graph.addEdge("N31_Lonavala",       "N32_Talegaon",        15.0);
        graph.addEdge("N32_Talegaon",       "N14_Hinjewadi",       12.0);
        graph.addEdge("N33_Chakan",         "N29_Airport",         12.0);

        System.out.printf("[GRAPH] Loaded: %d nodes, %d edges%n",
                graph.getNodeCount(), graph.getEdgeCount() / 2);
        return graph;
    }
}
