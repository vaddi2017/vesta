def detect_ats(url):

    url = url.lower()

    if "greenhouse" in url:
        return "greenhouse"

    if "lever" in url:
        return "lever"

    if "ashby" in url:
        return "ashby"

    if "workday" in url:
        return "workday"

    return "generic"