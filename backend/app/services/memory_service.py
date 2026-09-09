from datetime import datetime
from bson import ObjectId

from app.database.db import (
    fs,
    memory_gallery_collection
)


def save_memory(
    patient_id,
    image_file,
    name
):

    image_id = fs.put(
        image_file,
        filename=image_file.filename,
        content_type=image_file.content_type
    )

    memory = {
        "patient_id": patient_id,
        "name": name,
        "image_id": str(image_id),
        "created_at": datetime.utcnow()
    }

    result = memory_gallery_collection.insert_one(memory)

    return str(result.inserted_id)


def get_patient_memories(patient_id):

    memories = list(
        memory_gallery_collection.find(
            {
                "patient_id": patient_id
            }
        ).sort(
            "created_at",
            -1
        )
    )

    formatted_memories = []

    for memory in memories:

        formatted_memories.append({
            "id": str(memory["_id"]),
            "name": memory.get("name", ""),
            "image_url":
                f"/api/memory/{memory['_id']}/image"
        })

    return formatted_memories


def get_memory_image(memory_id, patient_id):

    memory = memory_gallery_collection.find_one({
        "_id": ObjectId(memory_id),
        "patient_id": patient_id
    })

    if not memory:
        return None

    image = fs.get(
        ObjectId(memory["image_id"])
    )

    return image