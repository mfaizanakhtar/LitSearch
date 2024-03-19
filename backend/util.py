from bson import ObjectId

def transform_paper_json(input):
    return dict(input, **{
        "journalName": input.get("journal").get("name")
    }) if input and input.get("journal") else input

def convert_to_serializable(doc):
    if isinstance(doc, dict):
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, dict):
                # Recursive call for nested dictionary
                doc[key] = convert_to_serializable(value)
            elif isinstance(value, list):
                # Recursive call for each item in the list
                doc[key] = [convert_to_serializable(item) if isinstance(item, dict) else item for item in value]
    return doc

def parse_mongo_dict(input):
    if input is None: return None
    input["_id"]=str(input["_id"])
    return input