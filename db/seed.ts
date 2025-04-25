import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Check if we already have algorithm categories
    const existingCategories = await db.query.algorithmCategories.findMany();
    
    if (existingCategories.length === 0) {
      console.log("Seeding algorithm categories...");
      
      // Seed algorithm categories
      const categories = [
        {
          name: "Sorting",
          description: "Algorithms that put elements of a list in a certain order"
        },
        {
          name: "Searching",
          description: "Algorithms that retrieve information stored within some data structure"
        },
        {
          name: "Pathfinding",
          description: "Algorithms that find the shortest path from one point to another"
        },
        {
          name: "Graph",
          description: "Algorithms that perform operations on graph data structures"
        }
      ];
      
      const insertedCategories = await db.insert(schema.algorithmCategories).values(categories).returning();
      console.log(`Inserted ${insertedCategories.length} algorithm categories`);
      
      // Get category IDs for reference
      const sortingCategoryId = insertedCategories.find(c => c.name === "Sorting")?.id;
      const searchingCategoryId = insertedCategories.find(c => c.name === "Searching")?.id;
      const pathfindingCategoryId = insertedCategories.find(c => c.name === "Pathfinding")?.id;
      const graphCategoryId = insertedCategories.find(c => c.name === "Graph")?.id;
      
      // Only proceed if we have the necessary categories
      if (sortingCategoryId && searchingCategoryId && pathfindingCategoryId && graphCategoryId) {
        console.log("Seeding algorithms...");
        
        // Seed algorithms
        const algorithmsData = [
          // Sorting Algorithms
          {
            name: "Bubble Sort",
            description: "A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            categoryId: sortingCategoryId,
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",
            pseudocode: 
`procedure bubbleSort(A: list of sortable items)
    n = length(A)
    repeat
        swapped = false
        for i = 1 to n-1
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure`,
            explanation: "1. Repeatedly step through the list to be sorted\n2. Compare each pair of adjacent items\n3. Swap the items if they are in the wrong order\n4. Continue until no more swaps are needed",
            bestCase: "O(n)",
            averageCase: "O(n²)",
            worstCase: "O(n²)",
            steps: JSON.stringify([
              "Compare adjacent elements",
              "Swap if the first element is greater than the second",
              "Move to the next pair",
              "After one pass, the largest element is at the end",
              "Repeat for the remaining elements"
            ])
          },
          {
            name: "Quick Sort",
            description: "A divide-and-conquer sorting algorithm that picks an element as a pivot and partitions the array around the pivot.",
            categoryId: sortingCategoryId,
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(log n)",
            pseudocode: 
`function quickSort(arr, low, high)
    if low < high then
        pivot = partition(arr, low, high)
        quickSort(arr, low, pivot - 1)
        quickSort(arr, pivot + 1, high)
    end if
end function

function partition(arr, low, high)
    pivot = arr[high]
    i = low - 1
    for j = low to high - 1 do
        if arr[j] <= pivot then
            i = i + 1
            swap arr[i] with arr[j]
        end if
    end for
    swap arr[i + 1] with arr[high]
    return i + 1
end function`,
            explanation: "1. Choose a pivot element from the array\n2. Partition the array around the pivot (elements less than pivot to the left, greater to the right)\n3. Recursively apply the above steps to the sub-arrays\n4. The base case is arrays of size zero or one, which are already sorted",
            bestCase: "O(n log n)",
            averageCase: "O(n log n)",
            worstCase: "O(n²)",
            steps: JSON.stringify([
              "Choose a pivot element",
              "Partition the array around the pivot",
              "Apply recursively to the left subarray",
              "Apply recursively to the right subarray",
              "Combine the sorted subarrays"
            ])
          },
          {
            name: "Merge Sort",
            description: "A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
            categoryId: sortingCategoryId,
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n)",
            pseudocode: 
`function mergeSort(arr)
    if length(arr) <= 1 then
        return arr
    end if
    
    mid = length(arr) / 2
    left = mergeSort(arr[0...mid-1])
    right = mergeSort(arr[mid...length(arr)-1])
    
    return merge(left, right)
end function

function merge(left, right)
    result = []
    i = 0, j = 0
    
    while i < length(left) and j < length(right) do
        if left[i] <= right[j] then
            append left[i] to result
            i = i + 1
        else
            append right[j] to result
            j = j + 1
        end if
    end while
    
    append remaining elements of left to result
    append remaining elements of right to result
    
    return result
end function`,
            explanation: "1. Divide the unsorted array into n sub-arrays, each containing one element\n2. Repeatedly merge sub-arrays to produce new sorted sub-arrays\n3. Continue until there is only one sub-array remaining\n4. Merging is done by comparing the first elements of both sub-arrays and taking the smaller one",
            bestCase: "O(n log n)",
            averageCase: "O(n log n)",
            worstCase: "O(n log n)",
            steps: JSON.stringify([
              "Divide the array into two halves",
              "Recursively sort the left half",
              "Recursively sort the right half",
              "Merge the sorted halves",
              "Return the merged array"
            ])
          },
          
          // Searching Algorithms
          {
            name: "Binary Search",
            description: "An efficient search algorithm that finds the position of a target value within a sorted array.",
            categoryId: searchingCategoryId,
            timeComplexity: "O(log n)",
            spaceComplexity: "O(1)",
            pseudocode: 
`function binarySearch(arr, target)
    left = 0
    right = length(arr) - 1
    
    while left <= right do
        mid = (left + right) / 2
        
        if arr[mid] == target then
            return mid
        else if arr[mid] < target then
            left = mid + 1
        else
            right = mid - 1
        end if
    end while
    
    return -1 // Not found
end function`,
            explanation: "1. Compare the target value to the middle element of the array\n2. If they are equal, return the middle position\n3. If the target is less than the middle element, search the left half\n4. If the target is greater than the middle element, search the right half\n5. Repeat until the target is found or the search space is empty",
            bestCase: "O(1)",
            averageCase: "O(log n)",
            worstCase: "O(log n)",
            steps: JSON.stringify([
              "Compare target with middle element",
              "If equal, return the index",
              "If target is less, search the left half",
              "If target is greater, search the right half",
              "Repeat until found or search space is empty"
            ])
          },
          {
            name: "Linear Search",
            description: "A simple search algorithm that checks each element of the list until the target element is found or the list ends.",
            categoryId: searchingCategoryId,
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)",
            pseudocode: 
`function linearSearch(arr, target)
    for i = 0 to length(arr) - 1 do
        if arr[i] == target then
            return i
        end if
    end for
    
    return -1 // Not found
end function`,
            explanation: "1. Start from the first element of the array\n2. Compare each element with the target value\n3. If the element is found, return its position\n4. If the array is completely traversed without finding the target, return -1",
            bestCase: "O(1)",
            averageCase: "O(n/2)",
            worstCase: "O(n)",
            steps: JSON.stringify([
              "Start from the first element",
              "Compare with the target value",
              "If equal, return the index",
              "If not, move to the next element",
              "Repeat until found or end of list"
            ])
          },
          
          // Pathfinding Algorithms
          {
            name: "Dijkstra's Algorithm",
            description: "An algorithm that finds the shortest paths between nodes in a weighted graph.",
            categoryId: pathfindingCategoryId,
            timeComplexity: "O((V+E)log V)",
            spaceComplexity: "O(V)",
            pseudocode: 
`function dijkstra(graph, source)
    dist = array of size |V| initialized to infinity
    dist[source] = 0
    priority_queue Q
    Q.insert(source, 0)
    
    while Q is not empty do
        u = Q.extract_min()
        
        for each neighbor v of u do
            alt = dist[u] + length(u, v)
            if alt < dist[v] then
                dist[v] = alt
                Q.decrease_key(v, alt)
            end if
        end for
    end while
    
    return dist
end function`,
            explanation: "1. Initialize distances of all vertices as infinite and the source as zero\n2. Create a priority queue and insert the source\n3. While the queue is not empty, extract the minimum distance vertex\n4. For each adjacent vertex, update its distance if a shorter path is found\n5. Insert updated vertices back into the queue",
            bestCase: "O((V+E)log V)",
            averageCase: "O((V+E)log V)",
            worstCase: "O((V+E)log V)",
            steps: JSON.stringify([
              "Initialize distances (inf for all except source)",
              "Create a priority queue with the source",
              "Extract vertex with minimum distance",
              "Update distances to all neighbors",
              "Repeat until queue is empty"
            ])
          },
          {
            name: "A* Search",
            description: "A best-first search algorithm that finds the shortest path from a start node to a goal node using a heuristic function.",
            categoryId: pathfindingCategoryId,
            timeComplexity: "O(E)",
            spaceComplexity: "O(V)",
            pseudocode: 
`function a_star(graph, start, goal)
    open_set = {start}
    came_from = empty map
    g_score = map with default value of infinity
    g_score[start] = 0
    f_score = map with default value of infinity
    f_score[start] = heuristic(start, goal)
    
    while open_set is not empty do
        current = node in open_set with lowest f_score
        if current = goal then
            return reconstruct_path(came_from, current)
        end if
        
        open_set.remove(current)
        for each neighbor of current do
            tentative_g_score = g_score[current] + d(current, neighbor)
            if tentative_g_score < g_score[neighbor] then
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)
                if neighbor not in open_set then
                    open_set.add(neighbor)
                end if
            end if
        end for
    end while
    
    return failure
end function`,
            explanation: "1. Maintain two sets: open (nodes to be evaluated) and closed (already evaluated nodes)\n2. Start with the initial node in the open set\n3. For each iteration, select the node with the lowest f(n) = g(n) + h(n)\n4. g(n) is the cost from the start to the current node\n5. h(n) is the heuristic estimated cost from the current node to the goal\n6. Continue until the goal is reached or the open set is empty",
            bestCase: "O(E)",
            averageCase: "O(E)",
            worstCase: "O(E)",
            steps: JSON.stringify([
              "Initialize open set with start node",
              "Calculate f-score = g-score + heuristic",
              "Select node with lowest f-score",
              "Process neighbors and update scores",
              "Repeat until goal is reached"
            ])
          },
          
          // Graph Algorithms
          {
            name: "BFS",
            description: "Breadth-First Search is an algorithm for traversing or searching tree or graph data structures, starting at a given vertex and exploring all neighbors before moving to the next level.",
            categoryId: graphCategoryId,
            timeComplexity: "O(V+E)",
            spaceComplexity: "O(V)",
            pseudocode: 
`function bfs(graph, start)
    queue = [start]
    visited = {start}
    
    while queue is not empty do
        vertex = queue.dequeue()
        
        for each neighbor of vertex do
            if neighbor not in visited then
                visited.add(neighbor)
                queue.enqueue(neighbor)
            end if
        end for
    end while
end function`,
            explanation: "1. Start at a given vertex and mark it as visited\n2. Visit all adjacent unvisited vertices and mark them as visited\n3. Use a queue to keep track of vertices to visit next\n4. Continue until the queue is empty (all reachable vertices have been visited)",
            bestCase: "O(V+E)",
            averageCase: "O(V+E)",
            worstCase: "O(V+E)",
            steps: JSON.stringify([
              "Start at the source vertex",
              "Mark it as visited and enqueue",
              "Dequeue a vertex and visit all its neighbors",
              "Enqueue unvisited neighbors",
              "Repeat until queue is empty"
            ])
          },
          {
            name: "DFS",
            description: "Depth-First Search is an algorithm for traversing or searching tree or graph data structures, starting at a given vertex and exploring as far as possible along each branch before backtracking.",
            categoryId: graphCategoryId,
            timeComplexity: "O(V+E)",
            spaceComplexity: "O(V)",
            pseudocode: 
`function dfs(graph, start)
    visited = {}
    
    function dfs_visit(vertex)
        visited.add(vertex)
        
        for each neighbor of vertex do
            if neighbor not in visited then
                dfs_visit(neighbor)
            end if
        end for
    end function
    
    dfs_visit(start)
end function`,
            explanation: "1. Start at a given vertex and mark it as visited\n2. Recursively visit all adjacent unvisited vertices\n3. Use a stack (typically through recursion) to keep track of vertices to visit\n4. Backtrack when a vertex has no unvisited adjacent vertices",
            bestCase: "O(V+E)",
            averageCase: "O(V+E)",
            worstCase: "O(V+E)",
            steps: JSON.stringify([
              "Start at the source vertex",
              "Mark it as visited",
              "Recursively visit an unvisited neighbor",
              "Backtrack when no unvisited neighbors remain",
              "Repeat until all vertices are visited"
            ])
          }
        ];
        
        const insertedAlgorithms = await db.insert(schema.algorithms).values(algorithmsData).returning();
        console.log(`Inserted ${insertedAlgorithms.length} algorithms`);
      }
    } else {
      console.log(`Skipping algorithm categories seeding as ${existingCategories.length} categories already exist`);
    }
    
    // Check if we have any users
    const existingUsers = await db.query.users.findMany();
    
    if (existingUsers.length === 0) {
      console.log("Seeding default user...");
      
      // Create a default user for testing
      const [defaultUser] = await db.insert(schema.users).values({
        username: "demo",
        password: "password123" // In a real app, this would be hashed
      }).returning();
      
      console.log(`Created default user with ID ${defaultUser.id}`);
      
      // Create default user preferences
      await db.insert(schema.userPreferences).values({
        userId: defaultUser.id,
        animationSpeed: 3,
        arraySize: 20,
        theme: "light",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log("Created default user preferences");
    } else {
      console.log(`Skipping user seeding as ${existingUsers.length} users already exist`);
    }
    
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
