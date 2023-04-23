import sys
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from urllib.request import urlretrieve
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import json

def create_multi_level_folders(path):
    try:
        os.makedirs(path)
        print(f"Multi-level folders created successfully: {path}")
    except FileExistsError:
        print(f"Folder already exists: {path}")
    except OSError as e:
        print(f"Error creating multi-level folders: {e}")

# Get the name of the collection from the command line argument
if len(sys.argv) < 2:
    print("Please specify the name of the opensea collection.")
    sys.exit(1)
collection_name = sys.argv[1]

create_multi_level_folders(f"nft_images/{collection_name}")

# Set up the chrome webdriver
chrome_options = Options()
# # chrome_options.add_argument("--headless")
# chrome_options.add_argument("--disable-gpu")
chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
driver = webdriver.Chrome(options=chrome_options)

driver.get(f"https://opensea.io/collection/{collection_name}")

max_images = 20  # NFT images are very similar. We only need a few images to identify a possible collection of NFTs

# Wait for the page to load
should_wait = True
while should_wait:
    wait = WebDriverWait(driver, 10)
    nfts = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//div[@class='sc-29427738-0 sc-bc136f28-1 dVNeWL bdGEfA Asset--loaded']")))
    print("Number of NFTs found: " + str(len(nfts)))

    downloaded = {}
    failed = {}

    # Download the images associated with each NFT
    should_wait = False
    for nft in nfts:
        meta = nft.find_element(By.XPATH, ".//a")
        contract_address = meta.get_attribute("href")
        image = nft.find_element(By.XPATH, ".//img")
        image_url = nft.find_element(By.XPATH, ".//img").get_attribute("src")
        image_name = image_url.split("/")[-1].split("?")[0]

        if 'placeholder' in image_name:
            print(f"Looks like still loading..., progress {num_images}, continue to wait")
            should_wait = True
            break

        if 'yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' in image_name:
            print(f"Skipping placeholder image: {image_url}")
            downloaded[image_name] = True
            continue

        image_path = os.path.join(f"nft_images/{collection_name}", image_name + ".jpg")
        print(f"Downloading {image_url} to {image_path}...")
        try:
            urlretrieve(image_url, image_path)
            downloaded[image_name] = True
        except:
            print(f"Failed to download image: {image_url}")
            failed[image_name] = True
            continue
        with open(os.path.join("nft_images", collection_name, image_name + ".json"), 'w') as f:
            f.write(json.dumps({
                "contract_address": contract_address,
                "image_url": image_url
            }))
    if should_wait:
        time.sleep(2)
        continue
    else:
        should_wait = True
        driver.execute_script("window.scrollBy(0, 600);")
        time.sleep(2) # wait for the page to load

    print(f"Downloaded {len(downloaded)} images successfully. Failed to download {len(failed)} images.")
    if len(downloaded) >= max_images:
        print(f"Downloaded {len(downloaded)} images successfully. Stopping.")
        break

# Output a message indicating how many images were downloaded and where they were saved
print(f"{len(downloaded)} images downloaded and saved to {os.path.abspath('nft_images')}.")

# Close the webdriver
driver.quit()
