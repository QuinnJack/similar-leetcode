import React, { useState, FormEvent } from "react";
import "./index.css";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogIcon,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./components/Dialog";
import { X } from "lucide-react";

const App: React.FC = () => {
  const [view, setView] = useState<"Find" | "Compare">("Find");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [similarities, setSimilarities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<number | null>(null);
  const [leetcodeUrl1, setLeetcodeUrl1] = useState("");
  const [leetcodeUrl2, setLeetcodeUrl2] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const resultsPerPage = 10;
  const chunkCount = 4;

  const fetchData = async (url: string) => {
    setLoading(true);
    const fileName = url.split("/").slice(-2, -1)[0];
    console.log(`Fetching data for file: ${fileName}`);

    try {
      let allData: string[][] = [];
      for (let i = 0; i < chunkCount; i++) {
        const response = await fetch(`./sorted_similarities_with_scores_chunk_${i + 1}.csv`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(','));
        if (i === 0) {
          allData.push(...rows);
        } else {
          allData.push(...rows.slice(1));
        }
      }

      const headers = allData[0];
      console.log("Headers:", headers);
      const fileIndex = headers.indexOf(fileName);
      console.log(`File index for ${fileName}: ${fileIndex}`);

      if (fileIndex === -1) {
        setDialogMessage("File name not found in the CSV data.");
        setDialogOpen(true);
        setLoading(false);
        return;
      }

      const similarities = allData
        .slice(1)
        .map((row) => ({
          fileName: row[0],
          score: parseFloat(row[fileIndex]),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(1);

      const tagsResponse = await fetch("./leetcode_q_full_info.csv");
      if (!tagsResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const tagsData = await tagsResponse.text();
      const tagsRows = tagsData.split("\n").map((row) => row.split(","));

      const tagsMap = new Map(
        tagsRows.slice(1).map((row) => {
          let tags: string[] = [];
          for (let i = 1; i < row.length - 1; i++) {
            let tag = row[i].trim();
            if (i === 1) {
              tag = tag.replace(/^\[\s*'/, "");
            }
            if (i === row.length - 2) {
              tag = tag.replace(/'\s*\]$/, "");
            }
            tag = tag.replace(/^'/, "").replace(/'$/, "");
            if (tag) {
              tags.push(tag);
            }
          }
          return [row[0], tags];
        })
      );

      const difficultyMap = new Map(
        tagsRows.slice(1).map((row) => [row[0], row[row.length - 1]])
      );

      const formattedSimilarities = similarities.map((similarity) => {
        const tags = tagsMap.get(similarity.fileName) || [];
        const difficulty = difficultyMap.get(similarity.fileName) || "Unknown";
        return { ...similarity, tags, difficulty };
      });

      console.log("Formatted similarities:", formattedSimilarities);

      setSimilarities(formattedSimilarities);
      setTotalPages(Math.ceil(formattedSimilarities.length / resultsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDialogMessage(`Error fetching data: ${(error as Error).message}`);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFindSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await fetchData(leetcodeUrl);
  };

  const handleExampleClick = async () => {
    const exampleUrl = "https://leetcode.com/problems/sort-an-array/";
    setLeetcodeUrl(exampleUrl);
    await fetchData(exampleUrl);
  };

  const handleCompareSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const fileName1 = leetcodeUrl1.split("/").slice(-2, -1)[0];
    const fileName2 = leetcodeUrl2.split("/").slice(-2, -1)[0];

    try {
      let allData: string[][] = [];
      for (let i = 0; i < chunkCount; i++) {
        const response = await fetch(`./sorted_similarities_with_scores_chunk_${i + 1}.csv`);
        const data = await response.text();
        const rows = data.split("\n").map((row) => row.split(","));
        if (i === 0) {
          allData.push(...rows);
        } else {
          allData.push(...rows.slice(1));
        }
      }

      const headers = allData[0];
      const fileIndex1 = headers.indexOf(fileName1);
      const fileIndex2 = headers.indexOf(fileName2);

      if (fileIndex1 === -1 || fileIndex2 === -1) {
        setDialogMessage("One or both file names not found in the CSV data.");
        setDialogOpen(true);
        setLoading(false);
        return;
      }

      const similarityScore = parseFloat(
        allData.find((row) => row[0] === fileName1)![fileIndex2]
      ).toFixed(2);
      setComparisonResult(parseFloat(similarityScore));
    } catch (error) {
      console.error("Error fetching data:", error);
      setDialogMessage(`Error fetching data: ${(error as Error).message}`);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = (page: number) => {
    const start = (page - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    return similarities.slice(start, end);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={() => setView("Find")}
          variant={view === "Find" ? "primary" : "secondary"}
        >
          Find
        </Button>
        <Button
          onClick={() => setView("Compare")}
          variant={view === "Compare" ? "primary" : "secondary"}
        >
          Compare
        </Button>
      </div>
      {view === "Find" && (
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              LeetCode Find Similar Problems
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter a LeetCode problem URL to find similar problems. URL should
              be in the form{" "}
              <code>
                https://leetcode.com/problems/<i>problem-name</i>/
              </code>
              .
              <br />
              <a
                href="#"
                onClick={handleExampleClick}
                className="text-blue-500 hover:underline"
              >
                Try this example
              </a>
            </p>
          </div>
          <form
            id="similarity-form"
            className="flex items-center gap-4"
            onSubmit={handleFindSubmit}
          >
            <Input
              id="leetcode-url"
              className="flex h-10 w-full bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground "
              placeholder="Enter a LeetCode problem URL"
              type="text"
              value={leetcodeUrl}
              onChange={(e) => setLeetcodeUrl(e.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              size="md"
              loading={loading}
              className="w-36" // Adjust the width as needed
            >
              {loading ? "Loading..." : "Search"}
            </Button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-md border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">
                    Problem Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">
                    Similarity Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">
                    Tagged Topics
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-200">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody
                id="results-table"
                className="bg-white divide-y divide-gray-300"
              >
                {renderPage(currentPage).map((similarity, index) => (
                  <tr
                    key={index}
                    className="bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-500 transition ease-in duration-100"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                      <a
                        href={`https://leetcode.com/problems/${similarity.fileName}/`}
                        className="text-blue-500 hover:underline"
                      >
                        {similarity.fileName
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (char: string) =>
                            char.toUpperCase()
                          )}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                      {similarity.score.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                      {similarity.tags.map((tag: string, tagIndex: number) => {
                        // Remove all quotes and brackets from the tag
                        const cleanedTag = tag.replace(/['"\[\]]/g, "");
                        return (
                          <div
                            key={tagIndex}
                            className="inline-flex w-fit items-center whitespace-nowrap border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md px-2 py-1 m-1"
                          >
                            {cleanedTag}
                          </div>
                        );
                      })}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                      <div
                        className={`inline-flex w-fit items-center whitespace-nowrap border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1 m-1 ${
                          similarity.difficulty === "Easy"
                            ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                            : similarity.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                            : similarity.difficulty === "Hard"
                            ? "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                            : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {similarity.difficulty}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className="px-4 py-2"
              variant="secondary"
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className="px-4 py-2"
              variant="secondary"
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {view === "Compare" && (
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              LeetCode Compare Two Problems
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter two LeetCode problem URLs to compare their similarity. URLs
              should be in the form{" "}
              <code>
                https://leetcode.com/problems/<i>problem-name</i>/
              </code>
              .
            </p>
          </div>
          <form
            id="comparison-form"
            className="flex flex-col gap-4"
            onSubmit={handleCompareSubmit}
          >
            <Input
              id="leetcode-url-1"
              className="flex h-10 w-full bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground "
              placeholder="Enter the first LeetCode problem URL"
              type="text"
              value={leetcodeUrl1}
              onChange={(e) => setLeetcodeUrl1(e.target.value)}
            />
            <Input
              id="leetcode-url-2"
              className="flex h-10 w-full bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground "
              placeholder="Enter the second LeetCode problem URL"
              type="text"
              value={leetcodeUrl2}
              onChange={(e) => setLeetcodeUrl2(e.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              size="md"
              loading={loading}
              className="w-36" // Adjust the width as neede d
            >
              {loading ? "Loading..." : "Compare"}
            </Button>
          </form>
          {comparisonResult !== null && (
            <div className="flex justify-center items-center ">
              <span className="text-1.5xl font-bold text-gray-700 dark:text-gray-200">
                Similarity Score:&nbsp;
              </span>
              <span id="similarity-score">{comparisonResult}</span>
            </div>
          )}
        </div>
      )}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Similarity scores are computed by taking all solutions to various
        Leetcode problems, computing their embeddings, and then computing their
        semantic similarity. The source for the solutions can be found in{" "}
        <a
          href="https://github.com/kamyu104/LeetCode-Solutions"
          className="text-blue-500 hover:underline"
        >
          this repository
        </a>
        .
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogIcon variant="error" Icon={X} />
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                size="md"
                variant="destructive"
                className="w-full sm:w-fit"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
