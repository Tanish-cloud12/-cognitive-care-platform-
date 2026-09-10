from flask import (
    Blueprint,
    request,
    jsonify,
    send_file
)

from io import BytesIO

from app.middleware.auth import role_required

from app.services.memory_service import (
    save_memory,
    get_patient_memories,
    get_memory_image
)


memory_bp = Blueprint(
    "memory",
    __name__,
    url_prefix="/api/memory"
)


@memory_bp.route("", methods=["POST"])
@role_required("patient")
def upload_memory(user_id, role):

    image = request.files.get("image")
    name = request.form.get("name")

    if not image:
        return jsonify({
            "message": "Image is required"
        }), 400

    if not name or not name.strip():
        return jsonify({
            "message": "Memory name is required"
        }), 400

    memory_id = save_memory(
        user_id,
        image,
        name.strip()
    )

    return jsonify({
        "message": "Memory saved successfully",
        "memory_id": memory_id
    }), 201


@memory_bp.route("", methods=["GET"])
@role_required("patient")
def get_memories(user_id, role):

    memories = get_patient_memories(
        user_id
    )

    return jsonify({
        "memories": memories
    }), 200


@memory_bp.route(
    "/<memory_id>/image",
    methods=["GET"]
)
@role_required("patient")
def get_image(user_id, role, memory_id):

    image = get_memory_image(
        memory_id,
        user_id
    )

    if not image:
        return jsonify({
            "message": "Memory not found"
        }), 404

    return send_file(
        BytesIO(image.read()),
        mimetype=image.content_type
    )