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
  if (functionName == "/student") {
    return studentEndPoint;
  }
}

