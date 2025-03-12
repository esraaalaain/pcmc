let doctorsList = [];
const path = "https://api.easydoc.sa/his/pcmc";

async function fetchDoctors(spcalization) {
    const apiUrl = `${path}/doctors`;
    const loadingElement = document.getElementById("loading");
    const container = document.querySelector(".pricing-area .row");

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Basic cGNtYzpFQHN5RG9jQHBjbWM="
            },
        });
        console.log("this is response", response);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const doctors = await response.json();
        console.log("doctors", doctors);
        doctorsList = doctors.rows.filter(doctor => doctor.department_name === spcalization);

        if (doctorsList.length === 0) {
            container.innerHTML = `<p style="color: red; text-align: center; margin-top: 3rem">لا يوجد أطباء حاليين في هذا القسم. </p>`;
        }

    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        container.innerHTML = `<p style="color: red; text-align: center;">حدث خطأ أثناء تحميل البيانات. </p>`;
    } finally {
        loadingElement.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // get url params
    const urlParams = new URLSearchParams(window.location.search);
    const specialization = urlParams.get("name");

    document.getElementById("department_name").textContent = specialization;

    console.log("Getting doctors of specialization:", specialization);

    fetchDoctors(specialization).then(() => {
        console.log("Doctors:", doctorsList);
        const container = document.getElementById("doctors");



        doctorsList.forEach(doctor => {



            let profile = stripHtml(doctor.profile);
            // STRIP HTML TAGS OF PROFILE

            let avatar = doctor.img_url ? `https://his.easydoc.sa/${doctor.img_url}` : "https://his.easydoc.sa/uploads/%D8%AF_%D9%87%D9%8A%D8%AB%D9%851.png";


            container.innerHTML += `
                <div class="col-lg-4 col-md-12">
                    <div class="pricing-box text-center mb-60">
                        <div class="pricing-head">
                            <h4>${doctor.name}</h4>
                            <div class="price-count mb-30">
                                <h2>${doctor.department_name}</h2>
                            </div>
                            <img src="${avatar}" alt="pricon">
                        </div>
                        <div class="pricing-body mb-40  text-right bold ">
                            ${profile}
                        </div>
                        <div class="pricing-btn ">
                            <a href="https://wa.me/9660124222240" class="btn">إحجز الأن <i
                                    class="fas fa-chevron-right "></i></a>
                        </div>
                    </div>
                </div>
            `;
        });
    });

});


function stripHtml(html) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
}