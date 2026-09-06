import React, { useState } from "react";

function MemoryGallery() {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [memoryName, setMemoryName] = useState("");

    const handlePhotoSelect = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        setSelectedPhoto({
            file: file,
            preview: imageUrl,
        });
    };

    const handleSavePhoto = () => {
        if (!selectedPhoto) {
            alert("Please select a photo first.");
            return;
        }

        if (!memoryName.trim()) {
            alert("Please enter a name for this memory.");
            return;
        }

        const newPhoto = {
            id: Date.now(),
            name: memoryName,
            image: selectedPhoto.preview,
        };

        setPhotos((previousPhotos) => [
            ...previousPhotos,
            newPhoto,
        ]);

        setSelectedPhoto(null);
        setMemoryName("");
    };

    return (
        <div>

            <h1>Memory Gallery</h1>

            <p>Your special memories</p>

            <h2>Add a Memory</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
            />

            {selectedPhoto && (
                <div>

                    <h3>Selected Photo</h3>

                    <img
                        src={selectedPhoto.preview}
                        alt="Selected memory"
                        width="200"
                    />

                    <br />

                    <input
                        type="text"
                        placeholder="Who or what is this?"
                        value={memoryName}
                        onChange={(event) =>
                            setMemoryName(event.target.value)
                        }
                    />

                    <br />

                    <button onClick={handleSavePhoto}>
                        Save Memory
                    </button>

                </div>
            )}

            <h2>My Memories</h2>

            {photos.length === 0 ? (
                <p>No memories added yet.</p>
            ) : (
                photos.map((photo) => (
                    <div key={photo.id}>

                        <img
                            src={photo.image}
                            alt={photo.name}
                            width="200"
                        />

                        <h3>{photo.name}</h3>

                    </div>
                ))
            )}

        </div>
    );
}

export default MemoryGallery;