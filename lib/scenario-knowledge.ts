// Public reference only. Keep private records, live inventory and business actions out of this module.
export const SCENARIO_KNOWLEDGE = {
  "products": [
    {
      "name": "Agora Mini Mic",
      "category": "microphone",
      "price": 79,
      "currency": "USD",
      "attributes": [
        "usb",
        "portable",
        "desk",
        "calls"
      ]
    },
    {
      "name": "Agora Studio Mic",
      "category": "microphone",
      "price": 179,
      "currency": "USD",
      "attributes": [
        "usb",
        "noise reduction",
        "headphone monitoring",
        "recording"
      ]
    },
    {
      "name": "Agora Desk Mic",
      "category": "microphone",
      "price": 129,
      "currency": "USD",
      "attributes": [
        "usb",
        "noise reduction",
        "desk"
      ]
    },
    {
      "name": "Agora Room Camera",
      "category": "camera",
      "price": 249,
      "currency": "USD",
      "attributes": [
        "wide angle",
        "room",
        "usb"
      ]
    },
    {
      "name": "Agora Desk Camera",
      "category": "camera",
      "price": 99,
      "currency": "USD",
      "attributes": [
        "usb",
        "1080p",
        "privacy shutter",
        "desk",
        "calls"
      ]
    },
    {
      "name": "Agora Studio Camera",
      "category": "camera",
      "price": 299,
      "currency": "USD",
      "attributes": [
        "usb",
        "4k",
        "autofocus",
        "recording"
      ]
    }
  ],
  "source": {
    "kind": "Fictional product comparison reference",
    "revision": "2026-11-05",
    "scope": "Six example products, their listed attributes and illustrative USD prices only; no stock or final quote."
  },
  "timeZone": "America/New_York",
  "comparisonGuide": {
    "usb": "A connection family; actual connector, OS and device support must be checked in full specifications.",
    "noiseReduction": "A listed feature, not a measured guarantee that background noise will disappear.",
    "headphoneMonitoring": "Useful when hearing the microphone signal matters; listed only on the Studio Mic in this example.",
    "cameraResolution": "1080p and 4K describe listed image resolution, not guaranteed call quality in every application.",
    "autofocus": "Listed on the Studio Camera; no speed, tracking or low-light performance is specified.",
    "wideAngle": "Listed for the Room Camera; no numeric angle or room-size coverage is specified."
  },
  "notProvided": [
    "Connector subtype or adapters",
    "Operating-system and phone compatibility",
    "Microphone pattern, sample rate or bit depth",
    "Camera frame rate or numeric field of view",
    "Included accessories",
    "Taxes, delivery fees, discounts or live stock"
  ]
} as const;
