const packages = [
  {
    id: "full-villa-night-10",
    name: "10 Pax Night Full Villa Package - 5.00 PM to 9.00 AM",
    basePrice: 35000,
    personMode: "ten",
    defaultGuests: 10,
    checkinTime: "5.00 PM",
    checkoutTime: "9.00 AM",
    checkoutOffsetDays: 1,
    extraPersonCharge: 2500
  },
  {
    id: "full-villa-24h-morning-10",
    name: "10 Pax 24 Hours Full Villa Package - 9.00 AM to 9.00 AM",
    basePrice: 55000,
    personMode: "ten",
    defaultGuests: 10,
    checkinTime: "9.00 AM",
    checkoutTime: "9.00 AM",
    checkoutOffsetDays: 1,
    extraPersonCharge: 2500
  },
  {
    id: "full-villa-24h-evening-10",
    name: "10 Pax 24 Hours Full Villa Package - 5.00 PM to 5.00 PM",
    basePrice: 55000,
    personMode: "ten",
    defaultGuests: 10,
    checkinTime: "5.00 PM",
    checkoutTime: "5.00 PM",
    checkoutOffsetDays: 1,
    extraPersonCharge: 2500
  },
  {
    id: "couple-day-out-01",
    name: "Couple Day Out Package 01 - Room Only",
    basePrice: 6000,
    personMode: "couple",
    defaultGuests: 2,
    checkinTime: "9.30 AM",
    checkoutTime: "4.30 PM",
    checkoutOffsetDays: 0
  },
  {
    id: "couple-day-out-02",
    name: "Couple Day Out Package 02 - Welcome Drink, Lunch & Evening Tea",
    basePrice: 8900,
    personMode: "couple",
    defaultGuests: 2,
    checkinTime: "9.30 AM",
    checkoutTime: "4.30 PM",
    checkoutOffsetDays: 0
  },
  {
    id: "couple-night-room-only",
    name: "Couple Night Package - Room Only",
    basePrice: 6500,
    personMode: "couple",
    defaultGuests: 2,
    checkinTime: "5.00 PM",
    checkoutTime: "9.00 AM",
    checkoutOffsetDays: 1
  },
  {
    id: "couple-night-bb",
    name: "Couple Night Package - B&B",
    basePrice: 9400,
    personMode: "couple",
    defaultGuests: 2,
    checkinTime: "5.00 PM",
    checkoutTime: "9.00 AM",
    checkoutOffsetDays: 1
  },
  {
    id: "couple-night-hf",
    name: "Couple Night Package - H/F",
    basePrice: 12300,
    personMode: "couple",
    defaultGuests: 2,
    checkinTime: "5.00 PM",
    checkoutTime: "9.00 AM",
    checkoutOffsetDays: 1
  },
  {
    id: "dayout-package",
    name: "Dayout Package",
    basePrice: 2500,
    personMode: "perPerson",
    defaultGuests: 1,
    checkinTime: "9.30 AM",
    checkoutTime: "4.30 PM",
    checkoutOffsetDays: 0
  }
];

const receiptMessage = "Please wait until one of our representatives contacts you. Thank you for choosing our establishment.";
const whatsappNumber = "94766475040";

let advanceReceiptDataUrl = "";
let advanceReceiptFileName = "";
let advanceReceiptFile = null;
let reviewImageDataUrl = "";
let reviewImageFileName = "";

const packageSelect = document.getElementById("packageSelect");
const checkinDate = document.getElementById("checkinDate");
const checkinTime = document.getElementById("checkinTime");
const checkoutDate = document.getElementById("checkoutDate");
const checkoutTime = document.getElementById("checkoutTime");
const guestCount = document.getElementById("guestCount");
const priceDisplay = document.getElementById("priceDisplay");
const bookingForm = document.getElementById("bookingForm");
const receiptPreview = document.getElementById("receiptPreview");
const advanceReceipt = document.getElementById("advanceReceipt");
const advanceReceiptPreview = document.getElementById("advanceReceiptPreview");

function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-link");
  const sections = document.querySelectorAll(".tab-section");
  const navLinks = document.querySelector(".nav-links");
  const menuToggle = document.querySelector(".menu-toggle");

  function activate(tabName) {
    tabButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tabName));
    sections.forEach(section => section.classList.toggle("active", section.id === tabName));
    if (navLinks) navLinks.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  tabButtons.forEach(btn => btn.addEventListener("click", () => activate(btn.dataset.tab)));
  document.querySelectorAll("[data-tab-target]").forEach(btn => btn.addEventListener("click", () => activate(btn.dataset.tabTarget)));

  document.querySelectorAll("[data-tab]").forEach(el => {
    if (el.classList.contains("brand")) {
      el.addEventListener("click", event => {
        event.preventDefault();
        activate(el.dataset.tab);
      });
    }
  });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }
}

function initGallery() {
  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (!grid || !window.ELITE_GALLERY) return;

  window.ELITE_GALLERY.forEach(item => {
    const card = document.createElement("button");
    card.className = "gallery-item";
    card.type = "button";
    card.innerHTML = `<img loading="lazy" src="${item.src}" alt="Elite Black Villa gallery image" />`;
    card.addEventListener("click", () => {
      lightboxImage.src = item.src;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
    grid.appendChild(card);
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });
}

function initPackages() {
  packages.forEach(pkg => {
    const option = document.createElement("option");
    option.value = pkg.id;
    option.textContent = pkg.name;
    packageSelect.appendChild(option);
  });
}

function getSelectedPackage() {
  return packages.find(pkg => pkg.id === packageSelect.value);
}

function addDays(dateString, days) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDateForDisplay(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

function formatLkr(value) {
  return `LKR ${Number(value || 0).toLocaleString("en-LK")}`;
}

function calculateTotal(pkg, guests) {
  if (!pkg) return 0;
  const count = Number(guests || pkg.defaultGuests || 1);

  if (pkg.personMode === "perPerson") {
    return pkg.basePrice * Math.max(1, count);
  }

  if (pkg.personMode === "ten") {
    const extra = Math.max(0, count - 10);
    return pkg.basePrice + (extra * (pkg.extraPersonCharge || 0));
  }

  return pkg.basePrice;
}

function updateBookingFields() {
  const pkg = getSelectedPackage();
  if (!pkg) {
    checkinTime.value = "";
    checkoutDate.value = "";
    checkoutTime.value = "";
    priceDisplay.value = "";
    return;
  }

  checkinTime.value = pkg.checkinTime;
  checkoutDate.value = checkinDate.value ? formatDateForDisplay(addDays(checkinDate.value, pkg.checkoutOffsetDays)) : "";
  checkoutTime.value = pkg.checkoutTime;

  if (!guestCount.value || packageSelect.dataset.lastPackage !== pkg.id) {
    guestCount.value = pkg.defaultGuests;
  }

  if (pkg.personMode === "couple") {
    guestCount.value = 2;
    guestCount.readOnly = true;
  } else {
    guestCount.readOnly = false;
  }

  packageSelect.dataset.lastPackage = pkg.id;
  priceDisplay.value = formatLkr(calculateTotal(pkg, guestCount.value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function collectBookingData() {
  const pkg = getSelectedPackage();
  const guests = Number(guestCount.value || 0);
  const total = calculateTotal(pkg, guests);
  const receiptNo = `EBV-${Date.now().toString().slice(-8)}`;
  const advanceAmountValue = document.getElementById("advanceAmount").value;

  return {
    receiptNo,
    hotelName: "Elite Black Villa",
    customerName: document.getElementById("customerName").value.trim(),
    phoneNumber: document.getElementById("phoneNumber").value.trim(),
    idNumber: document.getElementById("idNumber").value.trim(),
    checkinDateRaw: checkinDate.value,
    checkinDate: formatDateForDisplay(checkinDate.value),
    checkinTime: checkinTime.value,
    checkoutDate: checkoutDate.value,
    checkoutTime: checkoutTime.value,
    guests,
    packageName: pkg ? pkg.name : "",
    total,
    totalFormatted: formatLkr(total),
    advanceAmount: advanceAmountValue ? Number(advanceAmountValue) : 0,
    advanceAmountFormatted: advanceAmountValue ? formatLkr(Number(advanceAmountValue)) : "Not entered",
    specialRequest: document.getElementById("specialRequest").value.trim(),
    status: "PENDING",
    advanceReceiptFileName,
    advanceReceiptDataUrl
  };
}

function buildReceiptHtml(data, standalone = false) {
  const logo = standalone ? window.ELITE_LOGO_DATA : "assets/logo.jpg";
  const outerStyle = standalone ? `
    <style>
      body { margin: 0; padding: 24px; background: #f4f4f4; font-family: Arial, sans-serif; color: #111; }
      .receipt-card { max-width: 760px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 18px; padding: 24px; }
      .receipt-title { display: flex; gap: 14px; align-items: center; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 16px; }
      .receipt-title img { width: 92px; height: 92px; object-fit: cover; border-radius: 16px; }
      h2, h3, p { margin-top: 0; }
      .receipt-status { display: inline-block; background: #fff5da; color: #916000; border: 1px solid #e0b456; padding: 6px 12px; border-radius: 999px; font-weight: 900; }
      .receipt-list { list-style: none; padding: 0; margin: 16px 0; display: grid; gap: 8px; }
      .receipt-list li { display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px dashed #ddd; padding-bottom: 7px; }
      .receipt-total { font-size: 26px; font-weight: 950; text-align: right; margin: 18px 0; }
      .receipt-message { background: #f7f7f7; border-left: 4px solid #111; padding: 12px; border-radius: 10px; }
      .receipt-advance-photo { margin-top: 16px; border-top: 1px solid #ddd; padding-top: 16px; }
      .receipt-advance-photo img { width: 100%; max-height: 420px; object-fit: contain; border-radius: 12px; border: 1px solid #ddd; }
      .print-btn { margin-top: 16px; padding: 12px 16px; border: 0; border-radius: 10px; background: #111; color: #fff; font-weight: 800; cursor: pointer; }
      @media print { .print-btn { display: none; } body { background: #fff; padding: 0; } .receipt-card { border: 0; } }
    </style>
  ` : "";

  const printButton = standalone ? `<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>` : "";
  const advancePhotoHtml = data.advanceReceiptDataUrl ? `
    <div class="receipt-advance-photo">
      <h3>Advance Payment Receipt Photo</h3>
      <p>${escapeHtml(data.advanceReceiptFileName || "Uploaded receipt image")}</p>
      <img src="${data.advanceReceiptDataUrl}" alt="Advance payment receipt photo">
    </div>
  ` : `
    <div class="receipt-advance-photo">
      <h3>Advance Payment Receipt Photo</h3>
      <p>No image uploaded.</p>
    </div>
  `;

  return `
    ${outerStyle}
    <div class="receipt-card">
      <div class="receipt-title">
        <img src="${logo}" alt="Elite Black Villa logo">
        <div>
          <h2>Elite Black Villa</h2>
          <p>Pending Booking Receipt</p>
          <span class="receipt-status">${escapeHtml(data.status)}</span>
        </div>
      </div>
      <h3>Receipt No: ${escapeHtml(data.receiptNo)}</h3>
      <ul class="receipt-list">
        <li><strong>Customer Name</strong><span>${escapeHtml(data.customerName)}</span></li>
        <li><strong>Phone Number</strong><span>${escapeHtml(data.phoneNumber)}</span></li>
        <li><strong>ID Number</strong><span>${escapeHtml(data.idNumber)}</span></li>
        <li><strong>Check-in</strong><span>${escapeHtml(data.checkinDate)} | ${escapeHtml(data.checkinTime)}</span></li>
        <li><strong>Check-out</strong><span>${escapeHtml(data.checkoutDate)} | ${escapeHtml(data.checkoutTime)}</span></li>
        <li><strong>How Many Person</strong><span>${escapeHtml(data.guests)}</span></li>
        <li><strong>Package / Room Type</strong><span>${escapeHtml(data.packageName)}</span></li>
        <li><strong>Total Price</strong><span>${escapeHtml(data.totalFormatted)}</span></li>
        <li><strong>Advance Amount</strong><span>${escapeHtml(data.advanceAmountFormatted)}</span></li>
        <li><strong>Special Request</strong><span>${escapeHtml(data.specialRequest || "None")}</span></li>
      </ul>
      <div class="receipt-total">Total Price: ${escapeHtml(data.totalFormatted)}</div>
      <p class="receipt-message">${receiptMessage}</p>
      ${advancePhotoHtml}
      ${printButton}
    </div>
  `;
}

function downloadReceipt(data) {
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(data.receiptNo)} - Elite Black Villa Pending Receipt</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
${buildReceiptHtml(data, true)}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.receiptNo}-Elite-Black-Villa-Pending-Receipt.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function buildWhatsappText(data) {
  return [
    "New Booking Request - ELITE BLACK VILLA",
    "",
    `Receipt No: ${data.receiptNo}`,
    `Status: ${data.status}`,
    "",
    `Customer Name: ${data.customerName}`,
    `Phone Number: ${data.phoneNumber}`,
    `ID Number: ${data.idNumber}`,
    `Check-in: ${data.checkinDate} | ${data.checkinTime}`,
    `Check-out: ${data.checkoutDate} | ${data.checkoutTime}`,
    `How Many Person: ${data.guests}`,
    `Selected Package: ${data.packageName}`,
    `Total Price: ${data.totalFormatted}`,
    `Advance Amount: ${data.advanceAmountFormatted}`,
    `Advance Payment Receipt Photo: ${data.advanceReceiptFileName || "Not uploaded"}`,
    `Special Request: ${data.specialRequest || "None"}`,
    "",
    "Please contact the customer to confirm the booking.",
    "*Please attach your advance payment receipt screenshot in this WhatsApp chat.*"
  ].join("\n");
}

function openWhatsapp(data) {
  const encoded = encodeURIComponent(buildWhatsappText(data));
  const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
  window.open(url, "_blank");
}

async function shareAdvanceImageIfPossible(data) {
  if (!advanceReceiptFile) return;
  if (navigator.canShare && navigator.share && navigator.canShare({ files: [advanceReceiptFile] })) {
    try {
      await navigator.share({
        title: "Elite Black Villa Advance Receipt",
        text: `Advance receipt for ${data.customerName}. Receipt No: ${data.receiptNo}. Advance Amount: ${data.advanceAmountFormatted}`,
        files: [advanceReceiptFile]
      });
    } catch (error) {
      // Customer can still manually attach the file in WhatsApp.
    }
  }
}

function readImageFile(file, callback) {
  if (!file) {
    callback("", "");
    return;
  }
  const reader = new FileReader();
  reader.onload = event => callback(event.target.result, file.name);
  reader.readAsDataURL(file);
}

function initUploadPreviews() {
  if (advanceReceipt) {
    advanceReceipt.addEventListener("change", () => {
      const file = advanceReceipt.files && advanceReceipt.files[0];
      advanceReceiptFile = file || null;
      readImageFile(file, (dataUrl, fileName) => {
        advanceReceiptDataUrl = dataUrl;
        advanceReceiptFileName = fileName;
        if (dataUrl) {
          advanceReceiptPreview.classList.add("active");
          advanceReceiptPreview.innerHTML = `<img src="${dataUrl}" alt="Advance payment receipt preview"><p>${escapeHtml(fileName)}</p>`;
        } else {
          advanceReceiptPreview.classList.remove("active");
          advanceReceiptPreview.innerHTML = "";
        }
      });
    });
  }

  const reviewImage = document.getElementById("localReviewImage");
  const reviewPreview = document.getElementById("reviewImagePreview");
  if (reviewImage && reviewPreview) {
    reviewImage.addEventListener("change", () => {
      const file = reviewImage.files && reviewImage.files[0];
      readImageFile(file, (dataUrl, fileName) => {
        reviewImageDataUrl = dataUrl;
        reviewImageFileName = fileName;
        if (dataUrl) {
          reviewPreview.classList.add("active");
          reviewPreview.innerHTML = `<img src="${dataUrl}" alt="Review image preview"><p>${escapeHtml(fileName)}</p>`;
        } else {
          reviewPreview.classList.remove("active");
          reviewPreview.innerHTML = "";
        }
      });
    });
  }

  const copyReviewBtn = document.getElementById("copyReviewBtn");
  if (copyReviewBtn) {
    copyReviewBtn.addEventListener("click", async () => {
      const text = document.getElementById("localReviewText").value.trim();
      if (!text) {
        alert("Please type your review first.");
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        alert("Review text copied. Open Google Reviews and paste it there.");
      } catch {
        alert("Could not copy automatically. Please select and copy the review text manually.");
      }
    });
  }

  const sendReviewWhatsappBtn = document.getElementById("sendReviewWhatsappBtn");
  if (sendReviewWhatsappBtn) {
    sendReviewWhatsappBtn.addEventListener("click", () => {
      const reviewer = document.getElementById("localReviewerName").value.trim() || "Customer";
      const text = document.getElementById("localReviewText").value.trim();
      if (!text) {
        alert("Please type your review first.");
        return;
      }

      const message = [
        "New Customer Review - ELITE BLACK VILLA",
        "",
        `Customer Name: ${reviewer}`,
        `Review Text: ${text}`,
        `Review Image: ${reviewImageFileName || "Not uploaded"}`,
        "",
        "Note: If a review image was selected, please attach/send it manually in WhatsApp."
      ].join("\n");

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    });
  }
}

function initBookingForm() {
  if (!bookingForm) return;

  packageSelect.addEventListener("change", updateBookingFields);
  checkinDate.addEventListener("change", updateBookingFields);
  guestCount.addEventListener("input", updateBookingFields);

  bookingForm.addEventListener("submit", async event => {
    event.preventDefault();

    const pkg = getSelectedPackage();
    if (!pkg) {
      alert("Please select your package.");
      return;
    }

    updateBookingFields();
    const data = collectBookingData();

    receiptPreview.innerHTML = buildReceiptHtml(data, false);
    downloadReceipt(data);

    setTimeout(() => openWhatsapp(data), 700);
    setTimeout(() => shareAdvanceImageIfPossible(data), 1400);
  });
}

initTabs();
initGallery();
initPackages();
initUploadPreviews();
initBookingForm();
