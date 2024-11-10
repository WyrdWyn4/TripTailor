import React, { useState, useRef, useEffect } from 'react';
import '../styles/styles.css';
import Tags from '../config/tags.json';
import iconMap from '../config/iconMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function HomePage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [itineraries, setItineraries] = useState([]); // Itineraries will be fetched from backend
  const [boards, setBoards] = useState([]); // Boards will be fetched or updated from backend
  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardImage, setNewBoardImage] = useState(null);
  const tagContainerRef = useRef(null);

  useEffect(() => {
    // Fetch itineraries from your backend here
   
  }, []);

  useEffect(() => {
    // Fetch user's boards from your backend here
    
  }, []);

  const handleSave = (itineraryId) => {
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewBoardName(''); 
    setNewBoardImage(null); 
  };

  const handleSelectBoard = (boardId) => {
    // Save itinerary to the selected board by sending a request to your backend
    console.log(`Itinerary saved to board ${boardId}`);
    handleCloseModal(); 
  };

  const handleCreateNewBoard = () => {
    if (newBoardName.trim()) {
      const newBoard = {
        id: boards.length + 1, // ID should ideally be generated by the backend
        name: newBoardName,
        coverImage: newBoardImage, 
      };
      setBoards([...boards, newBoard]); // Update locally, sync with backend
      setNewBoardName(''); 
      setNewBoardImage(null); 
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBoardImage(URL.createObjectURL(file)); 
    }
  };

  const scrollTagsLeft = () => {
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollTagsRight = () => {
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const filteredItineraries = selectedTags.length
    ? itineraries.filter((itinerary) =>
        itinerary.tags.some((tag) => selectedTags.includes(tag))
      )
    : itineraries;

  return (
    <div>
      {/* Tag Filter Scrollable Container */}
      <div className="tagFiltersContainer">
        <button onClick={scrollTagsLeft} className="arrowButton">{'<'}</button>
        <div ref={tagContainerRef} className="tagContainer">
          {Object.values(Tags.categories).flat().map((tag) => (
            <div
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`tagItem ${selectedTags.includes(tag) ? 'selected' : ''}`}
            >
              <div className="tagIcon">
                {iconMap[tag] && <FontAwesomeIcon icon={iconMap[tag]} />}
              </div>
              <div className="tagLabel">{tag}</div>
            </div>
          ))}
        </div>
        <button onClick={scrollTagsRight} className="arrowButton">{'>'}</button>
      </div>

      {/* Feed Section: Filtered Itineraries */}
      <div className="resultsGrid" style={{ marginTop: '200px', padding: '0 70px' }}>
        {filteredItineraries.map((itinerary) => (
          <div key={itinerary.id} className="resultCard">
            <button className="saveButton" onClick={() => handleSave(itinerary.id)}>
              Save
            </button>
            <img src={itinerary.image} alt={itinerary.title} className="resultCardImage" />
            <div className="resultCardContent">
              <h3 className="resultCardTitle">{itinerary.title}</h3>
              <p className="cardLocation">{itinerary.location}</p>
              <p className="resultCardDescription">{itinerary.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Save Modal */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h2>Save</h2>
              <button className="closeButton" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modalBody">
              <input
                type="text"
                placeholder="Search"
                className="searchInput"
              />
              <div className="boardList">
                {boards.map((board) => (
                  <div key={board.id} className="boardItem" onClick={() => handleSelectBoard(board.id)}>
                    {board.coverImage ? (
                      <img src={board.coverImage} alt={board.name} className="boardImage" />
                    ) : (
                      <div className="boardImagePlaceholder">No Image</div>
                    )}
                    <span className="boardName">{board.name}</span>
                  </div>
                ))}
                <div className="newBoardInput">
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="New board name"
                    className="newBoardInputField"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="newBoardFileInput"
                  />
                  {newBoardImage && (
                    <img src={newBoardImage} alt="New board cover preview" className="newBoardPreview" />
                  )}
                  <button className="createBoardButton" onClick={handleCreateNewBoard}>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
