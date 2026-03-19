package com.smartride.engine.data;

import com.smartride.engine.graph.CityGraph;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * GraphSeeder - City Map Data Loader
 *
 * Loads a realistic city graph representing Pune, India.
 * 40 nodes (intersections/landmarks) with weighted edges (roads).
 * The graph is loaded into memory at startup via Spring PostConstruct.
 */
@Component
public class GraphSeeder {

    private final CityGraph cityGraph = new CityGraph();

    @PostConstruct
    public void seedGraph() {
        System.out.println("[INIT] Loading city graph...");

        // ====================================================
        //  NODES - City landmarks with GPS coordinates
        //  Format: addNode(id, latitude, longitude)
        // ====================================================

        // Central Zone
        cityGraph.addNode("N1_ShivajiNagar",      18.5308, 73.8475);
        cityGraph.addNode("N2_DeccanGymkhana",     18.5196, 73.8411);
        cityGraph.addNode("N3_FCRoad",             18.5272, 73.8400);
        cityGraph.addNode("N4_JMRoad",             18.5205, 73.8370);
        cityGraph.addNode("N5_SwagatSquare",       18.5165, 73.8558);

        // East Zone
        cityGraph.addNode("N6_Koregaon",           18.5362, 73.8938);
        cityGraph.addNode("N7_Kalyani",             18.5074, 73.9065);
        cityGraph.addNode("N8_Viman",               18.5679, 73.9143);
        cityGraph.addNode("N9_Kharadi",             18.5523, 73.9372);
        cityGraph.addNode("N10_Hadapsar",           18.5089, 73.9260);

        // West Zone
        cityGraph.addNode("N11_Kothrud",            18.5074, 73.8077);
        cityGraph.addNode("N12_Warje",              18.4832, 73.8050);
        cityGraph.addNode("N13_Bavdhan",            18.5127, 73.7789);
        cityGraph.addNode("N14_Hinjewadi",          18.5912, 73.7380);
        cityGraph.addNode("N15_Balewadi",           18.5720, 73.7712);

        // North Zone
        cityGraph.addNode("N16_AundhIT",            18.5588, 73.8073);
        cityGraph.addNode("N17_PimpriChinchwad",    18.6279, 73.8009);
        cityGraph.addNode("N18_Wakad",              18.5989, 73.7645);
        cityGraph.addNode("N19_Baner",              18.5590, 73.7868);
        cityGraph.addNode("N20_Pashan",             18.5352, 73.7989);

        // South Zone
        cityGraph.addNode("N21_Sinhagad",           18.4790, 73.8430);
        cityGraph.addNode("N22_Katraj",             18.4537, 73.8578);
        cityGraph.addNode("N23_Bibvewadi",          18.4795, 73.8660);
        cityGraph.addNode("N24_Kondhwa",            18.4700, 73.8900);
        cityGraph.addNode("N25_NIBM",               18.4630, 73.9080);

        // IT Hub Zone
        cityGraph.addNode("N26_Magarpatta",         18.5150, 73.9270);
        cityGraph.addNode("N27_PhoenixMall",        18.5600, 73.9155);
        cityGraph.addNode("N28_EON_IT",             18.5530, 73.9400);

        // Airport and Transit
        cityGraph.addNode("N29_Airport",            18.5822, 73.9197);
        cityGraph.addNode("N30_PuneStation",        18.5285, 73.8742);

        // Outskirts
        cityGraph.addNode("N31_Lonavala",           18.7557, 73.4091);
        cityGraph.addNode("N32_Talegaon",           18.7340, 73.6755);
        cityGraph.addNode("N33_Chakan",             18.7600, 73.8620);
        cityGraph.addNode("N34_Wagholi",            18.5820, 73.9720);
        cityGraph.addNode("N35_Undri",              18.4475, 73.9150);

        // Additional Detail Nodes
        cityGraph.addNode("N36_SB_Road",            18.5120, 73.8310);
        cityGraph.addNode("N37_LawCollege",         18.5130, 73.8380);
        cityGraph.addNode("N38_ModelColony",        18.5255, 73.8338);
        cityGraph.addNode("N39_Camp",               18.5120, 73.8780);
        cityGraph.addNode("N40_MG_Road",            18.5150, 73.8750);

        // ====================================================
        //  EDGES - Roads with distances in km
        //  Format: addEdge(from, to, distanceInKm)
        // ====================================================

        // Central Ring Roads
        cityGraph.addEdge("N1_ShivajiNagar",    "N3_FCRoad",           0.9);
        cityGraph.addEdge("N1_ShivajiNagar",    "N5_SwagatSquare",     1.5);
        cityGraph.addEdge("N1_ShivajiNagar",    "N30_PuneStation",     2.0);
        cityGraph.addEdge("N2_DeccanGymkhana",  "N3_FCRoad",           0.7);
        cityGraph.addEdge("N2_DeccanGymkhana",  "N4_JMRoad",           0.5);
        cityGraph.addEdge("N2_DeccanGymkhana",  "N37_LawCollege",      0.8);
        cityGraph.addEdge("N3_FCRoad",          "N38_ModelColony",     0.6);
        cityGraph.addEdge("N4_JMRoad",          "N36_SB_Road",         0.7);
        cityGraph.addEdge("N4_JMRoad",          "N37_LawCollege",      0.4);
        cityGraph.addEdge("N5_SwagatSquare",    "N30_PuneStation",     1.8);
        cityGraph.addEdge("N5_SwagatSquare",    "N39_Camp",            2.0);

        // East Corridor
        cityGraph.addEdge("N6_Koregaon",        "N30_PuneStation",     3.2);
        cityGraph.addEdge("N6_Koregaon",        "N27_PhoenixMall",     2.5);
        cityGraph.addEdge("N6_Koregaon",        "N39_Camp",            3.0);
        cityGraph.addEdge("N7_Kalyani",         "N10_Hadapsar",        2.2);
        cityGraph.addEdge("N7_Kalyani",         "N26_Magarpatta",      2.5);
        cityGraph.addEdge("N8_Viman",           "N29_Airport",         2.0);
        cityGraph.addEdge("N8_Viman",           "N27_PhoenixMall",     1.8);
        cityGraph.addEdge("N8_Viman",           "N9_Kharadi",          3.5);
        cityGraph.addEdge("N9_Kharadi",         "N28_EON_IT",          1.2);
        cityGraph.addEdge("N9_Kharadi",         "N34_Wagholi",         4.5);
        cityGraph.addEdge("N10_Hadapsar",       "N26_Magarpatta",      1.5);
        cityGraph.addEdge("N10_Hadapsar",       "N25_NIBM",            3.8);

        // West Corridor
        cityGraph.addEdge("N11_Kothrud",        "N36_SB_Road",         2.0);
        cityGraph.addEdge("N11_Kothrud",        "N12_Warje",           2.8);
        cityGraph.addEdge("N11_Kothrud",        "N20_Pashan",          2.5);
        cityGraph.addEdge("N12_Warje",          "N13_Bavdhan",         3.5);
        cityGraph.addEdge("N12_Warje",          "N21_Sinhagad",        3.0);
        cityGraph.addEdge("N13_Bavdhan",        "N15_Balewadi",        3.0);
        cityGraph.addEdge("N13_Bavdhan",        "N19_Baner",           2.8);
        cityGraph.addEdge("N14_Hinjewadi",      "N18_Wakad",           3.5);
        cityGraph.addEdge("N14_Hinjewadi",      "N15_Balewadi",        4.2);
        cityGraph.addEdge("N15_Balewadi",       "N19_Baner",           1.5);

        // North Corridor
        cityGraph.addEdge("N16_AundhIT",        "N19_Baner",           2.0);
        cityGraph.addEdge("N16_AundhIT",        "N20_Pashan",          2.2);
        cityGraph.addEdge("N16_AundhIT",        "N38_ModelColony",     3.5);
        cityGraph.addEdge("N17_PimpriChinchwad", "N18_Wakad",          3.8);
        cityGraph.addEdge("N17_PimpriChinchwad", "N33_Chakan",         8.0);
        cityGraph.addEdge("N18_Wakad",          "N19_Baner",           3.2);
        cityGraph.addEdge("N20_Pashan",         "N38_ModelColony",     1.8);

        // South Corridor
        cityGraph.addEdge("N21_Sinhagad",       "N22_Katraj",          3.5);
        cityGraph.addEdge("N21_Sinhagad",       "N23_Bibvewadi",       2.5);
        cityGraph.addEdge("N22_Katraj",         "N23_Bibvewadi",       2.0);
        cityGraph.addEdge("N23_Bibvewadi",      "N40_MG_Road",         3.0);
        cityGraph.addEdge("N24_Kondhwa",        "N25_NIBM",            2.5);
        cityGraph.addEdge("N24_Kondhwa",        "N23_Bibvewadi",       2.8);
        cityGraph.addEdge("N24_Kondhwa",        "N35_Undri",           3.5);

        // Cross Links (connecting zones)
        cityGraph.addEdge("N30_PuneStation",    "N40_MG_Road",         1.5);
        cityGraph.addEdge("N39_Camp",           "N40_MG_Road",         1.0);
        cityGraph.addEdge("N40_MG_Road",        "N10_Hadapsar",        5.5);
        cityGraph.addEdge("N36_SB_Road",        "N37_LawCollege",      0.5);
        cityGraph.addEdge("N27_PhoenixMall",    "N28_EON_IT",          3.0);
        cityGraph.addEdge("N27_PhoenixMall",    "N29_Airport",         3.5);
        cityGraph.addEdge("N29_Airport",        "N34_Wagholi",         6.0);

        // Highway Connections
        cityGraph.addEdge("N31_Lonavala",       "N32_Talegaon",        15.0);
        cityGraph.addEdge("N32_Talegaon",       "N14_Hinjewadi",       12.0);
        cityGraph.addEdge("N33_Chakan",         "N29_Airport",         12.0);

        System.out.printf("[INIT] City graph loaded: %d nodes, %d edges%n",
                cityGraph.getNodeCount(), cityGraph.getEdgeCount() / 2);
    }

    public CityGraph getCityGraph() {
        return cityGraph;
    }
}
