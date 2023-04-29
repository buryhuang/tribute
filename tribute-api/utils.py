import re


def get_referenced_artists(image_text):
    # Search for all occurrences of the phrase "inspired by" and extract the artist names
    pattern = r"inspired by (\w+(?: \w+)*)"
    matches = re.findall(pattern, image_text)
    if matches:
        print(matches)
        results = []
        initial_percent = 45
        factor = 0.35
        for match in matches:
            results.append({
                'name': match,
                # 'percentage': initial_percent
            })
            initial_percent = initial_percent * factor
        print(results)
        return results
    else:
        return None