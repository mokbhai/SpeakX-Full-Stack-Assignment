import React, { useEffect, useState } from "react";
import { QuestionsService } from "./grpc/client";
import { QuestionType } from "./grpc/questions_pb";
import QuestionCard from "./components/questions/QuestionCard";
import Pagination from "./components/common/Pagination";
import { BiSearch, BiFilterAlt, BiSelectMultiple } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import SearchSuggestions from "./components/SearchSuggestions";
import LoadingAnimation from "./components/common/LoadingAnimation";

function App() {
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [displayAllQuestionTypes, setDisplayAllQuestionTypes] = useState(false);

  useEffect(() => {
    setQuestionTypes(Object.keys(QuestionType));
    // Get initial filters from URL
    const typeFromUrl = searchParams.get("type") || "";
    const titleFromUrl = searchParams.get("title") || "";
    const pageFromUrl = parseInt(searchParams.get("page")) || 0;
    const pageSizeFromUrl =
      parseInt(searchParams.get("pageSize")) || pagination.itemsPerPage;
    const showAllFromUrl = searchParams.get("showAll") === "true";

    setSelectedType(typeFromUrl);
    setSearchText(titleFromUrl);
    setDisplayAllQuestionTypes(showAllFromUrl);

    // Initial search with URL parameters
    fetchQuestions(
      typeFromUrl,
      titleFromUrl,
      pageFromUrl,
      pageSizeFromUrl,
      showAllFromUrl
    );
    // eslint-disable-next-line
  }, []);

  const fetchQuestions = async (
    type = undefined,
    title = "",
    page = 0,
    pageSize = pagination.itemsPerPage,
    showAll = displayAllQuestionTypes
  ) => {
    setIsLoading(true);
    try {
      const response = await QuestionsService.searchQuestion({
        title: title,
        type: type !== undefined ? QuestionType[type] : undefined,
        pagination: {
          page: page,
          limit: pageSize,
        },
        displayAllQuestionTypes: showAll,
      });

      const questions = response.getQuestionsList();
      const paginationInfo = response.getPaginationinfo();

      setPagination({
        currentPage: paginationInfo.getCurrentpage(),
        totalPages: paginationInfo.getTotalpages(),
        totalItems: paginationInfo.getTotalitems(),
        itemsPerPage: paginationInfo.getItemsperpage(),
        hasNextPage: paginationInfo.getHasnextpage(),
        hasPreviousPage: paginationInfo.getHaspreviouspage(),
      });
      setQuestions(questions);
    } catch (error) {
      console.error("Error searching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUrlParams = (
    type,
    title,
    page = 0,
    pageSize = pagination.itemsPerPage,
    showAll = displayAllQuestionTypes
  ) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (title) params.set("title", title);
    if (page > 0) params.set("page", page.toString());
    if (pageSize !== 10) params.set("pageSize", pageSize.toString());
    params.set("showAll", showAll.toString());
    setSearchParams(params);
  };

  const handleQuestionSearch = (params) => {
    const {
      type = selectedType,
      title = searchText,
      page = 0,
      pageSize = pagination.itemsPerPage,
      showAll = displayAllQuestionTypes,
    } = params;

    // Update URL and fetch questions
    updateUrlParams(type, title, page, pageSize, showAll);
    fetchQuestions(type, title, page, pageSize, showAll);
  };

  const handleSearch = (title = searchText) => {
    handleQuestionSearch({ title });
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    handleQuestionSearch({ type: e.target.value });
  };

  const handlePageChange = (newPage) => {
    handleQuestionSearch({ page: newPage });
  };

  const handlePageSizeChange = (newSize) => {
    handleQuestionSearch({ pageSize: newSize });
  };

  const handleDisplayAllQuestionTypes = (e) => {
    const newValue = e.target.checked;
    setDisplayAllQuestionTypes(newValue);
    handleQuestionSearch({ showAll: newValue });
  };

  const handleClear = () => {
    setSelectedType("");
    setSearchText("");
    setDisplayAllQuestionTypes(false);
    setSearchParams(new URLSearchParams());
    handleQuestionSearch({
      type: "",
      title: "",
      page: 0,
      showAll: false,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-4 text-secondary-900">
            <BiFilterAlt className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filter Questions</h2>

            {/* Display All Types Checkbox */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="displayAllTypes"
                className="text-sm font-medium text-secondary-700 flex items-center gap-1"
              >
                [ Show All Question Types
              </label>
              <input
                type="checkbox"
                id="displayAllTypes"
                checked={displayAllQuestionTypes}
                onChange={handleDisplayAllQuestionTypes}
                className="rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
              />
              <label
                htmlFor="displayAllTypes"
                className="text-sm font-medium text-secondary-700 flex items-center gap-1"
              >
                ]
              </label>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-end">
            {/* Question Type Select */}
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Question Type
              </label>
              <div className="relative">
                <select
                  className="w-full rounded-lg border-secondary-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  value={selectedType}
                  onChange={handleTypeChange}
                >
                  {displayAllQuestionTypes
                    ? questionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))
                    : questionTypes.slice(0, 3).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Search Title
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <BiSearch className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border-secondary-300 pl-10 pr-12 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search by title..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {searchText && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setSearchText("")}
                  >
                    <IoCloseCircleOutline className="h-5 w-5 text-secondary-400 hover:text-secondary-500" />
                  </button>
                )}
              </div>
              <SearchSuggestions
                query={searchText}
                displayAllQuestionTypes={displayAllQuestionTypes}
                type={selectedType}
                onSelect={(title) => {
                  setSearchText(title);
                  handleSearch(title);
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:ml-4">
              <button
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                onClick={() => handleSearch()}
              >
                <BiSearch className="h-5 w-5" />
                <span>Search</span>
              </button>
              <button
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                onClick={handleClear}
              >
                <IoCloseCircleOutline className="h-5 w-5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-secondary-900">Questions</h2>
            <div className="text-sm text-secondary-500">
              {pagination.totalItems} results found
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <LoadingAnimation className="py-12" />
          ) : (
            <>
              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard key={question.getId()} question={question} />
                ))}
              </div>

              {/* Empty State */}
              {questions.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 mb-4">
                    <BiSearch className="h-8 w-8 text-secondary-400" />
                  </div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-1">
                    No questions found
                  </h3>
                  <p className="text-secondary-500">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {questions.length > 0 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
