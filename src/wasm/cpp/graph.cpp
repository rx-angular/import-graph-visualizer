#include <iostream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <string.h>
#include "libs/json.hpp"

using namespace std;
using json = nlohmann::json;

extern "C"
{
    inline const char *cstr(const std::string &str)
    {
        char *cstr = new char[str.length() + 1];
        strcpy(cstr, str.c_str());
        return cstr;
    }

    struct graph
    {
        vector<string> sources;
        vector<string> targets;
        unordered_map<string, vector<string>> adjacent;
    };

    void findAllPathsUtil(
        string &currVertex,
        unordered_set<string> &pathEnds,
        unordered_map<string, vector<string>> &adjacent,
        unordered_set<string> &visited,
        vector<string> &currPath,
        vector<vector<string>> &allPaths)
    {
        visited.insert(currVertex);
        currPath.push_back(currVertex);
        if (pathEnds.find(currVertex) != pathEnds.end())
        {
            vector<string> path(currPath);
            allPaths.push_back(path);
        }
        else
        {
            for (string adjVertex : adjacent[currVertex])
            {
                if (visited.find(adjVertex) == visited.end())
                {
                    findAllPathsUtil(adjVertex, pathEnds, adjacent, visited, currPath, allPaths);
                }
            }
        }
        visited.erase(currVertex);
        currPath.pop_back();
    }

    const char *findAllPaths(const char *jsonStr)
    {
        json jsonGraph = json::parse(jsonStr);
        graph graph;
        jsonGraph.at("sources").get_to(graph.sources);
        jsonGraph.at("targets").get_to(graph.targets);
        jsonGraph.at("adjacent").get_to(graph.adjacent);

        unordered_set<string> pathEnds(graph.targets.begin(), graph.targets.end());
        vector<vector<string>> allPaths;

        for (string source : graph.sources)
        {
            unordered_set<string> visited;
            vector<string> currPath;
            visited.reserve(graph.adjacent.size());
            currPath.reserve(graph.adjacent.size());
            findAllPathsUtil(source, pathEnds, graph.adjacent, visited, currPath, allPaths);
        }

        json jsonPaths(allPaths);

        return cstr(jsonPaths.dump());
    }
}