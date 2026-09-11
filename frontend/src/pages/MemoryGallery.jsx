import React, { useEffect, useState } from "react";
import { Images, Camera, Upload, Heart, ImageOff } from "lucide-react";
import "./MemoryGallery.css";
const API_URL = import.meta.env.VITE_API_URL;
function MemoryGallery() {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [memoryName, setMemoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const token = localStorage.getItem("access_token");

    // Load memories from MongoDB
    useEffect(() => {
        const loadMemories = async () => {
            if (!token) {
                setInitialLoading(false);
                return;
            }

            try {
                const response = await fetch(
                   `${API_URL}${memory.image_url}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(
                        "Could not load memories:",
                        data
                    );
                    return;
                }

                const memories = data.memories || [];

                // Load each image with JWT
                const memoriesWithImages = await Promise.all(
                    memories.map(async (memory) => {
                        try {
                            const imageResponse = await fetch(
                                `${API_URL}${memory.image_url}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );

                            if (!imageResponse.ok) {
                                console.error(
                                    "Could not load image:",
                                    memory.id
                                );
                                return memory;
                            }

                            const blob = await imageResponse.blob();
                            const imageUrl = URL.createObjectURL(blob);

                            return {
                                ...memory,
                                image: imageUrl
                            };
                        } catch (error) {
                            console.error(
                                "Image loading error:",
                                error
                            );
                            return memory;
                        }
                    })
                );

                setPhotos(memoriesWithImages);

            } catch (error) {
                console.error(
                    "Error loading memories:",
                    error
                );
            } finally {
                setInitialLoading(false);
            }
        };

        loadMemories();

        // Cleanup object URLs
        return () => {
            photos.forEach((photo) => {
                if (photo.image) {
                    URL.revokeObjectURL(photo.image);
                }
            });
        };
    }, [token]);

    // Select photo
    const handlePhotoSelect = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setSelectedPhoto({
            file: file,
            preview: imageUrl
        });
    };

    // Save photo to MongoDB
    const handleSavePhoto = async () => {
        if (!selectedPhoto) {
            alert("Please select a photo first.");
            return;
        }

        if (!memoryName.trim()) {
            alert("Please enter a name for this memory.");
            return;
        }

        if (!token) {
            alert("Please login again.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append(
                "image",
                selectedPhoto.file
            );

            formData.append(
                "name",
                memoryName.trim()
            );

            const response = await fetch(
                `${API_URL}/api/memory`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message || "Could not save memory."
                );
                return;
            }

            alert("Memory saved successfully!");

            // Clear selected photo
            setSelectedPhoto(null);
            setMemoryName("");

            // Reload memories from MongoDB
            const memoriesResponse = await fetch(
                `${API_URL}/api/memory`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const memoriesData = await memoriesResponse.json();

            if (!memoriesResponse.ok) {
                console.error(
                    "Could not reload memories:",
                    memoriesData
                );
                return;
            }

            const memories = memoriesData.memories || [];

            // Load images again with JWT
            const memoriesWithImages = await Promise.all(
                memories.map(async (memory) => {
                    const imageResponse = await fetch(
                        `${API_URL}${memory.image_url}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (!imageResponse.ok) {
                        return memory;
                    }

                    const blob = await imageResponse.blob();
                    const imageUrl = URL.createObjectURL(blob);

                    return {
                        ...memory,
                        image: imageUrl
                    };
                })
            );

            setPhotos(memoriesWithImages);

        } catch (error) {
            console.error(
                "Save memory error:",
                error
            );

            alert("Unable to connect to server.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="patient-gallery-page">
            {/* Page Header */}
            <header className="gallery-page-header">
                <div className="gallery-header-badge">
                    <Images size={18} className="gallery-badge-icon" aria-hidden="true" />
                    <span>Family Photo Album</span>
                </div>
                <h1 className="gallery-page-title">Memory Gallery</h1>
                <p className="gallery-page-subtitle">
                    Keep the moments that matter close to you.
                </p>
            </header>

            {/* Add Memory Card */}
            <section className="gallery-add-card" aria-labelledby="add-memory-title">
                <h2 id="add-memory-title" className="gallery-section-title">
                    Add a Memory
                </h2>

                {!selectedPhoto ? (
                    <label className="gallery-upload-zone" htmlFor="memory-file-input">
                        <input
                            id="memory-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden-file-input"
                        />
                        <div className="upload-icon-circle" aria-hidden="true">
                            <Camera size={36} />
                        </div>
                        <h3 className="upload-primary-text">Add a special memory</h3>
                        <p className="upload-supporting-text">
                            Choose a photo from your computer or phone
                        </p>
                        <span className="upload-choose-btn">
                            <Upload size={20} aria-hidden="true" />
                            <span>Choose Photo</span>
                        </span>
                    </label>
                ) : (
                    <div className="selected-photo-panel" aria-label="Photo upload preview">
                        <div className="selected-preview-content">
                            <div className="selected-image-frame">
                                <img
                                    src={selectedPhoto.preview}
                                    alt="Selected memory preview"
                                    className="selected-image-preview"
                                />
                            </div>

                            <div className="selected-details-form">
                                <label htmlFor="memory-name-input" className="input-label">
                                    Who or what is this photo?
                                </label>
                                <input
                                    id="memory-name-input"
                                    type="text"
                                    className="memory-name-input"
                                    placeholder="e.g. Summer vacation, Family dinner"
                                    value={memoryName}
                                    onChange={(event) =>
                                        setMemoryName(event.target.value)
                                    }
                                    aria-label="Name or description for this memory"
                                />

                                <div className="selected-action-buttons">
                                    <button
                                        type="button"
                                        className="memory-save-btn"
                                        onClick={handleSavePhoto}
                                        disabled={loading}
                                    >
                                        <Heart size={20} aria-hidden="true" />
                                        <span>{loading ? "Saving..." : "Save Memory"}</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="memory-cancel-btn"
                                        onClick={() => {
                                            setSelectedPhoto(null);
                                            setMemoryName("");
                                        }}
                                        disabled={loading}
                                    >
                                        Choose Different Photo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* My Memories Section */}
            <section className="gallery-memories-section" aria-labelledby="my-memories-title">
                <div className="memories-section-header">
                    <h2 id="my-memories-title" className="gallery-section-title">
                        My Memories
                    </h2>
                    {photos.length > 0 && (
                        <span className="memories-count-badge">
                            {photos.length} {photos.length === 1 ? "photo" : "photos"}
                        </span>
                    )}
                </div>

                {initialLoading ? (
                    <div className="gallery-loading-card" role="status">
                        <div className="gallery-spinner" aria-hidden="true"></div>
                        <p className="gallery-loading-text">Opening your photo album...</p>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="gallery-empty-card" role="region" aria-label="No memories">
                        <div className="empty-icon-circle" aria-hidden="true">
                            <Camera size={40} />
                        </div>
                        <h3 className="empty-title">No memories yet</h3>
                        <p className="empty-subtitle">
                            Add a special photo to keep a favorite moment close.
                        </p>
                        <div className="empty-guide-note">
                            Photos you add will appear here in your personal album.
                        </div>
                    </div>
                ) : (
                    <div className="gallery-photos-grid">
                        {photos.map((photo) => (
                            <article
                                key={photo.id}
                                className="memory-photo-card"
                                aria-label={`Memory: ${photo.name}`}
                            >
                                <div className="photo-image-frame">
                                    {photo.image ? (
                                        <img
                                            src={photo.image}
                                            alt={photo.name || "Special memory photo"}
                                            className="photo-card-img"
                                        />
                                    ) : (
                                        <div className="photo-fallback">
                                            <ImageOff size={32} aria-hidden="true" />
                                            <span>Photo could not be loaded</span>
                                        </div>
                                    )}
                                </div>

                                <div className="photo-card-caption">
                                    <h3 className="photo-card-name">{photo.name}</h3>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default MemoryGallery;