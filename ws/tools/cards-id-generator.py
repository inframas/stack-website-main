import uuid

def generate_id(length=32):
    # Generate a UUID and get its hex representation
    unique_id = uuid.uuid4().hex
    # Return the first `length` characters
    return unique_id[:length]

# Example usage
print(generate_id())  # Output: A 32-character long unique ID
