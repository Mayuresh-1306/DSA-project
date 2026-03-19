@echo off
echo ====================================================
echo  SmartRide Java Engine - Build Script
echo  (Pure Java, NO frameworks, NO Maven)
echo ====================================================

REM Create output directory
if not exist "out" mkdir out

echo [1/2] Compiling Java sources...
javac -d out src\com\smartride\engine\graph\CityGraph.java src\com\smartride\engine\algorithm\PathResult.java src\com\smartride\engine\algorithm\DriverCandidate.java src\com\smartride\engine\algorithm\DriverHeap.java src\com\smartride\engine\algorithm\DijkstraEngine.java src\com\smartride\engine\algorithm\AStarEngine.java src\com\smartride\engine\algorithm\DynamicPricingEngine.java src\com\smartride\engine\algorithm\GreedyMatcher.java src\com\smartride\engine\data\GraphSeeder.java src\com\smartride\engine\server\JsonHelper.java src\com\smartride\engine\server\SmartRideServer.java

if errorlevel 1 (
    echo [ERROR] Compilation FAILED!
    exit /b 1
)

echo [2/2] Compilation SUCCESSFUL!
echo.
echo To run the server:
echo   java -cp out com.smartride.engine.server.SmartRideServer
echo.
