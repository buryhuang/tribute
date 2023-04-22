import time
import pyautogui

# Wait for Discord app to open
# time.sleep(5)

# Click on Discord app icon in Dock
print("Locating to click on Discord app icon in Dock")
pyautogui.click(x=1034, y=1047)
time.sleep(1)

print("Locating to click on l0vec channel in Discord app")
pyautogui.click(x=35, y=150)
time.sleep(1)

# print("Locating to click on Midjourney Bot in Direct Messages")
# pyautogui.click(x=191, y=275)
# time.sleep(1)

print("Locating to click on Click on text input box in Midjourney Bot")
pyautogui.click(x=388, y=971)
time.sleep(1)

# Type message
print("Typing message in text input box in Midjourney Bot")
pyautogui.typewrite("/")
time.sleep(1)
pyautogui.typewrite("imagine pretty female young lady in a pink hat, in the style of rendered in cinema4d, lively street scenes, i can't believe how beautiful this is, relatable personality, rinpa school, realistic lighting --ar 48:49"
                    "")
time.sleep(1)

# Press enter to send message
print("Finished typing message in text input box in Midjourney Bot. Pressing enter to send message.")
pyautogui.press('enter')
time.sleep(1)
