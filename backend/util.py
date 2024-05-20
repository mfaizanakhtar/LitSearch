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


def decrement_last_decimal(number):
    # Convert the number to a string to find the decimal place
    num_str = str(number)
    if '.' in num_str:
        parts = num_str.split('.')
        decimal_places = len(parts[1])
    else:
        # If there is no decimal point, return the number itself
        return number

    # Calculate the smallest decrement for the last decimal place
    decrement = 10 ** (-decimal_places)
    
    # Subtract the decrement from the number
    new_number = number - decrement
    
    # Convert to string and adjust manually if needed
    new_number_str = f"{new_number:.{decimal_places}f}"
    
    return float(new_number_str)