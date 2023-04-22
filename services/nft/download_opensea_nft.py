import sys
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from urllib.request import urlretrieve
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

# Get the name of the collection from the command line argument
if len(sys.argv) < 2:
    print("Please specify the name of the opensea collection.")
    sys.exit(1)
collection_name = sys.argv[1]

# Set up the chrome webdriver
chrome_options = Options()
# chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
driver = webdriver.Chrome(options=chrome_options)

# Navigate to opensea.io and search for the specified collection
# driver.get("https://opensea.io")
# search_box = driver.find_element(By.XPATH, "//input[@placeholder='Search items, collections, and accounts']")
# search_box.send_keys(collection_name)
# search_box.submit()

# # Wait for the search box to become clickable
# search_box = WebDriverWait(driver, 10).until(
#     EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Search items, collections, and accounts']"))
# )
#
# # Interact with the search box
# search_box.send_keys(collection_name)

# # Simulate a "submit" action using ActionChains
# actions = ActionChains(driver)
# actions.move_to_element(search_box).perform()
# actions.key_down(Keys.ENTER).key_up(Keys.ENTER).perform()

# WebDriverWait(driver, 10).until(
#     EC.element_to_be_clickable((By.XPATH, "//div[@class='sc-29427738-0 sc-bc136f28-1 dVNeWL bdGEfA Asset--loaded']"))
# )


driver.get(f"https://opensea.io/assets?search[query]={collection_name}")

# Scrape the webpage to find all the NFTs associated with the collection
nfts = driver.find_elements(By.XPATH, "//div[@class='sc-29427738-0 sc-bc136f28-1 dVNeWL bdGEfA Asset--loaded']")

# Download the images associated with each NFT
num_images = 0
for nft in nfts:
    image = nft.find_element(By.XPATH, ".//img")
    print(image.get_attribute("inner_html"))
    image_url = nft.find_element(By.XPATH, ".//img").get_attribute("src")
    image_name = image_url.split("/")[-1] + ".jpg"
    image_path = os.path.join("nft_images", image_name)
    print(f"Downloading {image_url} to {image_path}...")
    urlretrieve(image_url, image_path)
    num_images += 1

# Output a message indicating how many images were downloaded and where they were saved
print(f"{num_images} images downloaded and saved to {os.path.abspath('nft_images')}.")
