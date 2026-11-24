(() => {
  "use strict";

  const form = document.getElementById("rentalForm");
  const deviceType = document.getElementById("deviceType");
  const dynamicOptions = document.getElementById("dynamicOptions");
  const serviceTier = document.getElementById("serviceTier");
  const tierField = document.getElementById("tierField");
  const packageOptions = document.getElementById("packageOptions");
  const addonsField = document.getElementById("addonsField");
  const addonOptions = document.getElementById("addonOptions");
  const membershipNote = document.getElementById("membershipNote");
  const estimateRow = document.getElementById("estimateRow");
  const confirmation = document.getElementById("confirmation");
  const requestSummary = document.getElementById("requestSummary");
  const copyStatus = document.getElementById("copyStatus");

  const packages = {
    pc: {
      title: "PC Forge Gaming",
      eyebrow: "PC GAMING / SESSION RATES",
      chip: "PC FORGE",
      tiers: [{
        value: "standard",
        label: "PC Gaming Zone",
        options: [
          { id: "pc-1", name: "1-Hour Drop-In", price: 35, duration: 1, description: "Quick warmup or a couple of matches." },
          { id: "pc-3", name: "3-Hour Grind Bundle", price: 95, duration: 3, description: "Post-class sessions and steady progression." },
          { id: "pc-5", name: "5-Hour Marathon Bundle", price: 150, duration: 5, description: "Weekend runs, scrims and extended sessions." },
          { id: "pc-midnight", name: "Midnight Grind", price: 120, duration: 6, description: "Overnight session, 12:00 AM–6:00 AM." }
        ]
      }]
    },
    mobile: {
      title: "Mobile Forge Gaming",
      eyebrow: "MOBILE GAMING / SESSION RATES",
      chip: "MOBILE FORGE",
      tiers: [
        {
          value: "flagship",
          label: "Tier 1 — Flagship Pro-Stage (Device + Booth)",
          options: [
            { id: "mobile-flagship-1", name: "1-Hour Stage Drop-In", price: 60, duration: 1, description: "Flagship device and full booth setup." },
            { id: "mobile-flagship-3", name: "3-Hour Scrim Block", price: 160, duration: 3, description: "Tournament prep, custom lobbies and ranked pushes." },
            { id: "mobile-flagship-5", name: "5-Hour Tournament Pass", price: 250, duration: 5, description: "Best solo rate for extended sessions." },
            { id: "mobile-flagship-team", name: "5-Stack Pro Stage · 3 Hours", price: 720, duration: 3, description: "₱144 per player; all five side-by-side stations." }
          ]
        },
        {
          value: "byod",
          label: "Tier 2 — BYOD Pro Booth (Bring Your Own Device)",
          options: [
            { id: "mobile-byod-1", name: "1-Hour Pro Booth", price: 30, duration: 1, description: "Bring your own phone and use the booth equipment." },
            { id: "mobile-byod-3", name: "3-Hour Squad Grind", price: 80, duration: 3, description: "Extended practice using your own device." },
            { id: "mobile-byod-team", name: "5-Stack BYOD Booth · 3 Hours", price: 350, duration: 3, description: "₱70 per player; five-player scrim session." }
          ]
        }
      ]
    },
    productivity: {
      title: "Focus Productivity",
      eyebrow: "PRODUCTIVITY / WORKSTATION RATES",
      chip: "FOCUS PRODUCTIVITY",
      tiers: [
        {
          value: "study",
          label: "Tier A — Study & Office Seat",
          options: [
            { id: "study-1", name: "1-Hour Drop-In", price: 30, duration: 1, description: "MS Office, Canva Pro and high-speed fiber." },
            { id: "study-3", name: "3-Hour Study Block", price: 80, duration: 3, description: "Thesis writing, research and schoolwork." },
            { id: "study-5", name: "5-Hour Deadline Pass", price: 125, duration: 5, description: "Extended study and project sessions." },
            { id: "study-member", name: "VIP Member Load-Up", price: 300, duration: 11, description: "11 hours on Study / Office seats, plus VIP perks." }
          ]
        },
        {
          value: "creator",
          label: "Tier B — Creator & CAD Workstation",
          options: [
            { id: "creator-1", name: "1-Hour Studio Drop-In", price: 50, duration: 1, description: "Adobe tools, AutoCAD and high-spec workstation." },
            { id: "creator-3", name: "3-Hour Project Sprint", price: 135, duration: 3, description: "CAD drafting, rendering and creative projects." },
            { id: "creator-5", name: "5-Hour Plate Pass", price: 200, duration: 5, description: "Extended creator and CAD workstation session." },
            { id: "creator-member", name: "VIP Member Load-Up", price: 300, duration: 7, description: "7 hours on Creator / CAD workstations, plus VIP perks." }
          ]
        }
      ]
    }
  };

  const productivityAddons = [
    { id: "pen-display", name: "Pen Display / Drawing Tablet (Huion / XPPen)", hourly: 20, flat3: 50, note: "+₱20/hr or ₱50 flat for a 3-hour session. Valid student / government ID deposit required." },
    { id: "dual-monitor", name: "Dual-Monitor VIP Booth Upgrade", hourly: 15, flat3: 35, note: "+₱15/hr or ₱35 flat for 3 hours." },
    { id: "portable-monitor", name: "Portable USB-C Second Monitor", hourly: 25, flat3: 60, note: "+₱25/hr or ₱60 flat for 3 hours. For BYOD laptop users." },
    { id: "office-headset", name: "Noise-Canceling Office Headset (Jabra)", hourly: 10, flat3: 0, note: "+₱10/hr; free with any 3-hour Creator / Study bundle and included with VIP membership." }
  ];

  let currentService = null;
  let currentSelection = null;
  let lastRequestText = "";

  function peso(amount) {
    return "₱" + Number(amount).toLocaleString("en-PH");
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach((el) => { el.textContent = ""; });
    document.querySelectorAll(".input-invalid").forEach((el) => el.classList.remove("input-invalid"));
  }

  function showError(id, message, inputId) {
    const error = document.getElementById(id);
    if (error) error.textContent = message;
    if (inputId) document.getElementById(inputId)?.classList.add("input-invalid");
  }

  function getSelectedPackage() {
    const selected = packageOptions.querySelector('input[name="selectedPackage"]:checked');
    if (!selected) return null;
    const allOptions = getAvailablePackages();
    return allOptions.find((item) => item.id === selected.value) || null;
  }

  function getCurrentTier() {
    if (!currentService) return null;
    return currentService.tiers.find((tier) => tier.value === serviceTier.value) || currentService.tiers[0];
  }

  function getAvailablePackages() {
    return getCurrentTier()?.options || [];
  }

  function renderPackages() {
    const options = getAvailablePackages();
    packageOptions.innerHTML = "";
    currentSelection = null;

    options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "package-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "selectedPackage";
      input.value = option.id;
      input.required = true;
      input.addEventListener("change", updateEstimate);

      const box = document.createElement("span");
      box.className = "package-option-box";

      const name = document.createElement("span");
      name.className = "package-name";
      name.textContent = option.name;

      const price = document.createElement("span");
      price.className = "package-price";
      price.textContent = peso(option.price);

      const meta = document.createElement("span");
      meta.className = "package-meta";
      meta.textContent = option.description;

      box.append(name, price, meta);
      label.append(input, box);
      packageOptions.append(label);

      if (index === 0) input.checked = false;
    });

    document.getElementById("packageError").textContent = "";
    estimateRow.hidden = true;
    renderAddons();
  }

  function renderAddons() {
    const show = deviceType.value === "productivity";
    addonsField.hidden = !show;
    addonOptions.innerHTML = "";

    if (!show) {
      document.getElementById("addonTotal").textContent = peso(0);
      return;
    }

    productivityAddons.forEach((addon) => {
      const label = document.createElement("label");
      label.className = "addon-option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "addons";
      input.value = addon.id;
      input.addEventListener("change", updateEstimate);

      const details = document.createElement("span");
      const name = document.createElement("span");
      name.className = "addon-name";
      name.textContent = addon.name;

      const note = document.createElement("span");
      note.className = "addon-meta";
      note.textContent = addon.note;

      details.append(name, note);
      label.append(input, details);
      addonOptions.append(label);
    });
    updateEstimate();
  }

  function getAddonCost(option) {
    const selectedIds = [...addonOptions.querySelectorAll('input[name="addons"]:checked')].map((input) => input.value);
    const pkg = getSelectedPackage();
    if (!pkg) return { total: 0, lines: [] };

    const tier = getCurrentTier();
    const isMember = option.id.endsWith("-member");
    const isThreeHourBundle = pkg.duration === 3 && (tier?.value === "study" || tier?.value === "creator");
    const lines = [];
    let total = 0;

    selectedIds.forEach((id) => {
      const addon = productivityAddons.find((item) => item.id === id);
      if (!addon) return;

      let cost;
      let detail;
      if (isMember && (id === "pen-display" || id === "office-headset")) {
        cost = 0;
        detail = "Included with VIP membership (subject to availability)";
      } else if (id === "office-headset" && isThreeHourBundle) {
        cost = 0;
        detail = "Free with 3-hour Study / Creator bundle";
      } else if (pkg.duration === 3 && addon.flat3 !== null) {
        cost = addon.flat3;
        detail = "3-hour flat rate";
      } else {
        cost = addon.hourly * pkg.duration;
        detail = `${peso(addon.hourly)} × ${pkg.duration} hours`;
      }

      total += cost;
      lines.push({ name: addon.name, cost, detail });
    });

    return { total, lines };
  }

  function updateEstimate() {
    const pkg = getSelectedPackage();
    if (!pkg) {
      estimateRow.hidden = true;
      document.getElementById("addonTotal").textContent = peso(0);
      return;
    }

    const addonResult = deviceType.value === "productivity" ? getAddonCost(pkg) : { total: 0, lines: [] };
    const total = pkg.price + addonResult.total;
    currentSelection = { package: pkg, addonResult, total };

    document.getElementById("packageEstimate").textContent = `${peso(pkg.price)} package${addonResult.total ? ` + ${peso(addonResult.total)} add-ons` : ""} = ${peso(total)} estimated`;
    document.getElementById("addonTotal").textContent = peso(addonResult.total);
    estimateRow.hidden = false;

    const tier = getCurrentTier();
    const isMember = pkg.id.endsWith("-member");
    if (deviceType.value === "productivity" && isMember) {
      membershipNote.hidden = false;
      membershipNote.textContent = `VIP Membership includes ${pkg.duration} workstation hours, plus free use of drawing tablets, noise-canceling headsets and USB-C multi-port hubs, subject to availability. Selected eligible perks are shown as included in the add-on estimate.`;
    } else {
      membershipNote.hidden = true;
    }
  }

  function renderService() {
    clearErrors();
    confirmation.hidden = true;
    const key = deviceType.value;
    currentService = packages[key] || null;
    currentSelection = null;

    if (!currentService) {
      dynamicOptions.hidden = true;
      return;
    }

    dynamicOptions.hidden = false;
    document.getElementById("serviceEyebrow").textContent = currentService.eyebrow;
    document.getElementById("serviceTitle").textContent = currentService.title;
    document.getElementById("selectedServiceChip").textContent = currentService.chip;

    const showTier = currentService.tiers.length > 1;
    tierField.hidden = !showTier;
    serviceTier.innerHTML = "";

    currentService.tiers.forEach((tier) => {
      const option = document.createElement("option");
      option.value = tier.value;
      option.textContent = tier.label;
      serviceTier.append(option);
    });

    renderPackages();
    membershipNote.hidden = true;
    document.getElementById("addonTotal").textContent = peso(0);
  }

  deviceType.addEventListener("change", renderService);
  serviceTier.addEventListener("change", () => {
    renderPackages();
    membershipNote.hidden = true;
  });

  function validateForm() {
    clearErrors();
    let valid = true;
    const fullName = document.getElementById("fullName");
    const mobile = document.getElementById("mobileNumber");
    const address = document.getElementById("address");

    if (fullName.value.trim().length < 2) {
      showError("fullNameError", "Please enter your full name.", "fullName");
      valid = false;
    }

    const digits = mobile.value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      showError("mobileNumberError", "Enter a valid mobile number (10–13 digits).", "mobileNumber");
      valid = false;
    }

    if (address.value.trim().length < 5) {
      showError("addressError", "Please enter your complete address.", "address");
      valid = false;
    }

    if (!deviceType.value) {
      showError("deviceTypeError", "Please choose a service.", "deviceType");
      valid = false;
    }

    if (deviceType.value && !getSelectedPackage()) {
      document.getElementById("packageError").textContent = "Please select one of the available rates.";
      valid = false;
    }

    if (!valid) {
      const firstInvalid = form.querySelector(".input-invalid, .field-error:not(:empty)");
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return valid;
  }

  function buildRequestText() {
    const pkg = getSelectedPackage();
    const service = packages[deviceType.value];
    const tier = getCurrentTier();
    const selectedAddons = currentSelection?.addonResult?.lines || [];
    const total = currentSelection?.total ?? pkg.price;

    const lines = [
      "NEXUS INFINITE — RENTAL REQUEST",
      "================================",
      `Name: ${document.getElementById("fullName").value.trim()}`,
      `Mobile number: ${document.getElementById("mobileNumber").value.trim()}`,
      `Address: ${document.getElementById("address").value.trim()}`,
      "",
      `Service: ${service.title}`,
      ...(tier && service.tiers.length > 1 ? [`Rental tier: ${tier.label}`] : []),
      `Selected rate: ${pkg.name}`,
      `Session: ${pkg.duration} hour${pkg.duration === 1 ? "" : "s"}`,
      `Package price: ${peso(pkg.price)}`,
    ];

    if (selectedAddons.length) {
      lines.push("", "HARDWARE ADD-ONS:");
      selectedAddons.forEach((addon) => lines.push(`- ${addon.name}: ${addon.cost === 0 ? "Included" : peso(addon.cost)} (${addon.detail})`));
      lines.push(`Add-on total: ${peso(currentSelection.addonResult.total)}`);
    }

    lines.push("", `ESTIMATED TOTAL: ${peso(total)}`, "", "Note: This is a prepared request summary, not a confirmed booking.");
    return lines.join("\n");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    updateEstimate();
    lastRequestText = buildRequestText();
    requestSummary.textContent = lastRequestText;
    confirmation.hidden = false;
    copyStatus.textContent = "";
    confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("copyRequest").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lastRequestText);
      copyStatus.textContent = "Request summary copied.";
    } catch (error) {
      copyStatus.textContent = "Copy is unavailable in this browser. You can select and copy the summary above.";
    }
  });

  document.getElementById("downloadRequest").addEventListener("click", () => {
    const blob = new Blob([lastRequestText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nexus-infinite-rental-request.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    copyStatus.textContent = "Request summary downloaded.";
  });

  document.getElementById("editRequest").addEventListener("click", () => {
    confirmation.hidden = true;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
