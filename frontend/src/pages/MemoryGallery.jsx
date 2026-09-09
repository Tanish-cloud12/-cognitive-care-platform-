import React, { useEffect, useState } from "react";

function MemoryGallery() {

    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [memoryName, setMemoryName] = useState("");
    const [loading, setLoading] = useState(false);


    const token = localStorage.getItem("access_token");


    // Load memories from MongoDB
    useEffect(() => {

        const loadMemories = async () => {

            if (!token) {
                return;
            }

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/memory",
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
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


                const memories =
                    data.memories || [];


                // Load each image with JWT
                const memoriesWithImages =
                    await Promise.all(

                        memories.map(
                            async (memory) => {

                                try {

                                    const imageResponse =
                                        await fetch(
                                            `http://127.0.0.1:5000${memory.image_url}`,
                                            {
                                                method: "GET",
                                                headers: {
                                                    Authorization:
                                                        `Bearer ${token}`
                                                }
                                            }
                                        );


                                    if (
                                        !imageResponse.ok
                                    ) {

                                        console.error(
                                            "Could not load image:",
                                            memory.id
                                        );

                                        return memory;
                                    }


                                    const blob =
                                        await imageResponse.blob();


                                    const imageUrl =
                                        URL.createObjectURL(
                                            blob
                                        );


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
                            }
                        )
                    );


                setPhotos(
                    memoriesWithImages
                );


            } catch (error) {

                console.error(
                    "Error loading memories:",
                    error
                );
            }
        };


        loadMemories();


        // Cleanup object URLs
        return () => {

            photos.forEach((photo) => {

                if (photo.image) {
                    URL.revokeObjectURL(
                        photo.image
                    );
                }

            });

        };

    }, [token]);


    // Select photo
    const handlePhotoSelect = (event) => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const imageUrl =
            URL.createObjectURL(file);


        setSelectedPhoto({
            file: file,
            preview: imageUrl
        });
    };


    // Save photo to MongoDB
    const handleSavePhoto = async () => {

        if (!selectedPhoto) {

            alert(
                "Please select a photo first."
            );

            return;
        }


        if (!memoryName.trim()) {

            alert(
                "Please enter a name for this memory."
            );

            return;
        }


        if (!token) {

            alert(
                "Please login again."
            );

            return;
        }


        setLoading(true);


        try {

            const formData =
                new FormData();


            formData.append(
                "image",
                selectedPhoto.file
            );


            formData.append(
                "name",
                memoryName.trim()
            );


            const response =
                await fetch(
                    "http://127.0.0.1:5000/api/memory",
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        },

                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Could not save memory."
                );

                return;
            }


            alert(
                "Memory saved successfully!"
            );


            // Clear selected photo
            setSelectedPhoto(null);
            setMemoryName("");


            // Reload memories from MongoDB
            const memoriesResponse =
                await fetch(
                    "http://127.0.0.1:5000/api/memory",
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const memoriesData =
                await memoriesResponse.json();


            if (!memoriesResponse.ok) {

                console.error(
                    "Could not reload memories:",
                    memoriesData
                );

                return;
            }


            const memories =
                memoriesData.memories || [];


            // Load images again with JWT
            const memoriesWithImages =
                await Promise.all(

                    memories.map(
                        async (memory) => {

                            const imageResponse =
                                await fetch(
                                    `http://127.0.0.1:5000${memory.image_url}`,
                                    {
                                        method: "GET",
                                        headers: {
                                            Authorization:
                                                `Bearer ${token}`
                                        }
                                    }
                                );


                            if (
                                !imageResponse.ok
                            ) {
                                return memory;
                            }


                            const blob =
                                await imageResponse.blob();


                            const imageUrl =
                                URL.createObjectURL(
                                    blob
                                );


                            return {
                                ...memory,
                                image: imageUrl
                            };
                        }
                    )
                );


            setPhotos(
                memoriesWithImages
            );


        } catch (error) {

            console.error(
                "Save memory error:",
                error
            );


            alert(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div>

            <h1>
                Memory Gallery
            </h1>


            <p>
                Your special memories
            </p>


            <h2>
                Add a Memory
            </h2>


            <input
                type="file"
                accept="image/*"
                onChange={
                    handlePhotoSelect
                }
            />


            {selectedPhoto && (
                <div>

                    <h3>
                        Selected Photo
                    </h3>


                    <img
                        src={
                            selectedPhoto.preview
                        }
                        alt="Selected memory"
                        width="200"
                    />


                    <br />
                    <br />


                    <input
                        type="text"
                        placeholder="Who or what is this?"
                        value={memoryName}
                        onChange={(event) =>
                            setMemoryName(
                                event.target.value
                            )
                        }
                    />


                    <br />
                    <br />


                    <button
                        onClick={
                            handleSavePhoto
                        }
                        disabled={loading}
                    >

                        {loading
                            ? "Saving..."
                            : "Save Memory"}

                    </button>

                </div>
            )}


            <h2>
                My Memories
            </h2>


            {photos.length === 0 ? (

                <p>
                    No memories added yet.
                </p>

            ) : (

                photos.map((photo) => (

                    <div
                        key={photo.id}
                    >

                        {photo.image ? (

                            <img
                                src={photo.image}
                                alt={photo.name}
                                width="200"
                            />

                        ) : (

                            <p>
                                Image could not be loaded.
                            </p>

                        )}


                        <h3>
                            {photo.name}
                        </h3>

                    </div>

                ))

            )}

        </div>
    );
}


export default MemoryGallery;