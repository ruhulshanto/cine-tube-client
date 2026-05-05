# 🧪 HLS Stream Debugging Guide

## Current State

- **All stream URLs**: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8` (known-working)
- **HLS.js debug mode**: ENABLED (`debug: true`)
- **Console logging**: 9 HLS events logged with prefixes

---

## 🎬 What to Look For in Browser Console

### ✅ **SUCCESSFUL STREAM LOAD** (You'll see this sequence):

```
[HLS] 🎬 INIT: Starting stream load for https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
[HLS] 📺 HLS instance created, loading source...
[HLS] 🎥 MEDIA_ATTACHED: Video element linked to HLS
[HLS] 📥 MANIFEST_LOADING: Fetching manifest...
[HLS] 📦 MANIFEST_LOADED: Manifest received
[HLS] 📨 FRAG_LOADING: Loading video segment...
[HLS] ✅ MANIFEST_PARSED: Stream ready to play!
```

### ❌ **STREAM LOAD FAILS** (You'll see one of these):

#### **CORS / Network Block:**

```
[HLS] 🌐 NETWORK_ERROR: Could not fetch resource
[HLS] Details: {type: "networkError", details: "Failed to fetch", ...}
```

#### **404 / Invalid URL:**

```
[HLS] ❌ ERROR: {
  type: "NetworkError",
  details: "404: Manifest not found",
  fatal: true,
  ...
}
```

#### **CORS in Browser Network Tab:**

```
net::ERR_FAILED
Access to XMLHttpRequest blocked by CORS policy
```

#### **Timeout (8s with no events):**

```
[HLS] 📺 HLS instance created, loading source...
[HLS] 🎥 MEDIA_ATTACHED: Video element linked to HLS
[HLS] ⏰ TIMEOUT: Manifest not parsed in 8s
```

---

## 🔍 How to Debug

### **STEP 1: Build & Start**

```bash
cd cine-tube-client
pnpm build
pnpm dev
```

### **STEP 2: Open Browser DevTools**

- Right-click → Inspect
- Click **Console** tab
- Look for `[HLS]` prefix messages

### **STEP 3: Click a Channel**

Watch the console for the event sequence above.

### **STEP 4: Check Network Tab**

- Click **Network** tab
- Switch channels
- Look for `.m3u8` request
- Check:
  - Status code (should be 200, not 403/404)
  - CORS headers in Response tab
  - `Access-Control-Allow-Origin: *`

---

## 📊 Root Cause Detection

| Symptom                   | Root Cause            | Proof in Console                               |
| ------------------------- | --------------------- | ---------------------------------------------- |
| **Stream loads in <2s**   | ✅ Code is fine       | `MANIFEST_PARSED` fires                        |
| **"Loading..." forever**  | ❌ Stream URL issue   | No `MANIFEST_PARSED`, timeout hits             |
| **CORS error in console** | ❌ Stream URL blocked | `NETWORK_ERROR` + browser error                |
| **404 error**             | ❌ Stream URL invalid | `NETWORK_ERROR` with 404 details               |
| **Loads then stops**      | ❌ Stream unavailable | `MANIFEST_PARSED` fires but video doesn't play |

---

## ✅ If Stream Loads Successfully

**This proves:**

- ✅ Code logic is correct
- ✅ HLS.js integration works
- ✅ Player component handles events properly
- ✅ The loading timeout/onLoaded callback system works

**Next step:** Replace `test-streams.mux.dev` with production stream URLs

---

## ❌ If Stream Fails to Load

**Look for:**

1. Which event STOPS appearing? (manifests loading never completes, etc.)
2. Check browser Network tab for the `.m3u8` request
3. Check response status (200 vs 403 vs 404)
4. Check CORS headers

**DO NOT** assume code is broken until you see the network request failing in DevTools Network tab.

---

## 🧹 Cleanup After Testing

Once you confirm the stream works:

1. **Replace test URL with production stream:**

   ```typescript
   // In channels.ts
   streamUrl: "https://your-production-stream.m3u8";
   ```

2. **Disable debug logging (optional):**

   ```typescript
   // In LivePlayer.tsx
   debug: false, // Turn off hls.js internal logs
   ```

3. **Remove console.log prefixes if desired:**
   - But KEEP error logging for production debugging

---

## 🎯 Decision Tree

```
Channel clicked
    ↓
Console shows [HLS] logs?
    ├─ YES → Stream URL is loaded
    │   ├─ MANIFEST_PARSED fires? → ✅ STREAM WORKS
    │   └─ MANIFEST_PARSED never fires? → ❌ STREAM FAILED
    │       └─ Check Network tab for error
    └─ NO → HLS.js not initializing
        └─ Check if HLS.isSupported() is true
```

---

## 📝 Notes

- **test-streams.mux.dev** is a public demo stream from Mux - reliable for testing
- **hls.js debug mode** shows extra internal logs (you'll see lots of activity)
- **8-second timeout** ensures UI never gets stuck
- **All 8 HLS events** logged so you can see exactly where failures occur
