// ========== Include reusable HTML (e.g., navbar, header, footer) ==========
async function includeHTML(id, file) {
  try {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    document.getElementById(id).innerHTML = `<p>Error loading ${file}</p>`;
    console.error("Error including HTML:", file, err);
  }
}

// =============== Fetch Post Call =================
async function postCall(endPoint, data) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  finalEndPoint = postCallPreProcess(endPoint);

  try {
    const response = await fetch(baseUrl + finalEndPoint, {
      method: "POST",
      headers: myHeaders,
      body: data,
    });
    const responseData = await response.json();
    if (response.status == 200) {
      return responseData;
    } else if (response.status == 401) {
      throw new Error(responseData.result.message ?? "Not Authenticated");
    } else if (response.status == 409) {
      return responseData;
    } else {
      throw new Error(responseData.message ?? "Unknown error occurred");
    }
  } catch (error) {
    alert(error);
    return null;
  }
}

function postCallPreProcess(functionName) {
  // Student functions
  if (functionName == "/student") {
    return studentEndPoint;
  }
  // Subject functions
  else if (functionName == "/subject") {
    return subjectEndPoint;
  }
  // Teacher functions
  else if (functionName == "/teacher") {
    return teacherEndPoint;
  }
  // TODO delete ths later
  else return "";
  // else return mainEndPoint;
}

// ========== Handle browser back/forward navigation ==========
window.addEventListener("popstate", async (event) => {
  const page = event.state?.page || location.pathname.split("/").pop();
  if (page && page !== "welcome.html") {
    try {
      const response = await fetch(page);
      const html = await response.text();
      document.getElementById("content").innerHTML = html;

      if (typeof runPageScript === "function") {
        runPageScript(page);
      }
    } catch (err) {
      document.getElementById("content").innerHTML =
        "<p>Error loading page.</p>";
      console.error("Popstate load error:", err);
    }
  }
});

function sanitizeInput(input) {
  let regex = /[&<>"'/]/g;

  let sanitizedInput = input.replace(regex, function (match) {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#x27;";
      case "/":
        return "&#x2F;";
      default:
        return match;
    }
  });
  return sanitizedInput.trim();
}
