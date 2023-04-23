## Indexing opensea collection

Opensea seems to be throttling selenium browsers, so we will use mannual debug Chrome session for it.

### 1. Run manual session with debug port

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="~/ChromeProfile"
```

### 2. Run the script

```
python3 download_opensea_nft.py boredapeyachtclub
```
