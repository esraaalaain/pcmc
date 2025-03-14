let doctorsList = [];
let specializations = [];

async function fetchDoctorsBasedOnSpecilization(spcalization) {
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

async function departmentInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const specialization = urlParams.get("name");

    document.getElementById("department_name").textContent = specialization;

    console.log("Getting doctors of specialization:", specialization);

    fetchDoctorsBasedOnSpecilization(specialization).then(() => {
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
                        <div class="pricing-body mb-40 text-right bold" style="height: 100px; overflow: hidden; text-overflow: ellipsis;">
                            ${profile}
                        </div>
                        <div class="pricing-btn">
                        <div class="book-now-btn" data-doctor-id="${doctor.id}" 
                       data-doctor-name="${doctor.name}">
                            <span class="btn">إحجز الأن <i
                                    class="fas fa-chevron-right "></i></span>
                                    </div>
                        </div>
                    </div>
                </div>
            `;
        });
        attachBookingEventListeners();
    });

}

async function indexInit() {
    document.addEventListener("DOMContentLoaded", async () => {
        await fetchDoctors();
        specializationPlacement();
    });
}


const path = "https://api.easydoc.sa/his/pcmc";


console.log("this is start hellow :)");

async function specializationPlacement() {
    try {
        if (specializations.length === 0) {
            specializations = await getSpecializations();
        }

        if (specializations.length > 0) {
            const container = document.getElementById("departments");
            container.innerHTML = "";

            specializations.forEach(spec => {
                const uriEncodedName = encodeURIComponent(spec.name);
                const specializationItem = `
                    <div class="col-lg-4 col-md-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                        <div class="service-item  position-relative">
                            <div class="icon">
                                <i class="fas fa-heartbeat"></i>
                            </div>
                            <a href="department.php?name=${uriEncodedName}" class="stretched-link">
                                <h3>${spec.name}</h3>
                            </a>
                            <p>${spec.description}.</p>
                        </div>
                    </div>
                `
                container.innerHTML += specializationItem;
            });
        }
    } catch (error) {
        console.error("Error loading specializations:", error);
    }
}

async function getSpecializations() {
    const apiUrl = `${path}/departments`;
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

    const specializations = await response.json();

    // remove html elements from the description
    specializations.rows.forEach(spec => {
        spec.description = stripHtml(spec.description);
    });

    specializationsList = specializations.rows;

    console.log("this is specializationsList", specializationsList);
    return specializationsList;
}

async function fetchDoctors() {
    const apiUrl = `${path}/doctors`;
    const loadingElement = document.getElementById("loading");
    const container = document.querySelector(".pricing-area .row");

    try {
        loadingElement.style.display = "block";

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
        doctorsList = doctors.rows;
        displayDoctors(doctorsList);

    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        container.innerHTML = `<p style="color: red; text-align: center;">حدث خطأ أثناء تحميل البيانات. </p>`;
    } finally {
        loadingElement.style.display = "none";
    }
}
window.searchByNationalId = function () {

    const nationalId = document.getElementById("national_id").value;
    if (nationalId.length < 10) {
        // alert("الرجاء إدخال رقم الهوية الوطنية بشكل صحيح");
        return;
    }
    const apiUrl = `${path}/search?nationalId=${nationalId}`;
    const container = document.getElementById("searchResult");
    console.log("this is nationalId", nationalId);
    if (!nationalId) {
        container.innerHTML = `<p style="color: red; text-align: center;">الرجاء إدخال رقم الهوية الوطنية. </p>`;
        return;
    }

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic cGNtYzpFQHN5RG9jQHBjbWM="
        },
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        referrerPolicy: "no-referrer"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(patient => {
            if (patient) {
                container.innerHTML = `
                    <p class="text-primary bg-light"><strong>الاسم:</strong> ${patient.name}</p>
                `;
                document.getElementById("patient_id").value = patient.id;
            }
        })
        .catch(error => {
            console.error("Error fetching patient data:", error);
            container.innerHTML = `<p class="text-primary" style="color: red; text-align: center;">حدث خطأ أثناء البحث عن المريض.</p>`;
        });
};

function displayDoctors(doctors) {
    const container = document.getElementById("doctors");
    container.innerHTML = "";

    doctors.forEach(doctor => {

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
                        <div class="pricing-body mb-40 text-right bold" style="height: 100px; overflow: hidden; text-overflow: ellipsis;">
                            ${profile}
                        </div>
                        <div class="pricing-btn">
                        <div class="book-now-btn" data-doctor-id="${doctor.id}" 
                       data-doctor-name="${doctor.name}">
                            <span class="btn">إحجز الأن <i
                                    class="fas fa-chevron-right "></i></span>
                                    </div>
                            </div>
                        </div>
                    </div>
            `;
    });

    attachBookingEventListeners();
}

function stripHtml(html) {
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
}

function translateWeekday(weekday) {
    const days = {
        "Saturday": "السبت",
        "Sunday": "الأحد",
        "Monday": "الإثنين",
        "Tuesday": "الثلاثاء",
        "Wednesday": "الأربعاء",
        "Thursday": "الخميس",
        "Friday": "الجمعة"
    };
    return days[weekday] || weekday;
}

function getAvailableSlotByDoctorByDate() {
    // Implementation here
}

function attachBookingEventListeners() {
    console.log("Attaching booking event listeners");
    $(document).ready(function () {
        console.log("Document ready");
        $(".book-now-btn").click(function () {
            console.log("Click registered");
            // Get doctor data from button attributes
            let doctorId = $(this).data("doctor-id");
            console.log("Doctor ID:", doctorId);
            let doctorName = $(this).data("doctor-name");
            let currentDoctor = doctorsList.find(doctor => doctor.id === doctorId);


            console.log("Doctor data:", currentDoctor);

            console.log(doctorsList);

            let doctorVisitType = currentDoctor.doctor_visit;
            // Set doctor details inside the modal
            $("#dr-name").val(doctorName);
            $("#doctor-id").val(doctorId);

            let visitTypeSelect = $("#visit_description");
            visitTypeSelect.empty();
            doctorVisitType.forEach(visit => {
                visitTypeSelect.append(new Option(visit.visit_description, visit.id));
            });
            let visitCharges = doctorVisitType[0].visit_charges;
            $("#visit_charges").val(visitCharges);
            // add doctor days to select
            $("#weekday-picker").empty();

            // add day-btn
            currentDoctor.time_schedule.forEach(slot => {
                $("#weekday-picker").append(`
                    <button type="button" class="day-btn bg-light" onclick="selectDay(this, '${slot.weekday}', ${currentDoctor.id})">
                        <p>${translateWeekday(slot.weekday)}</p>
                    </button>
                `);

            });

            // Show the modal
            $("#exampleModal").modal("show");
        });
    });
}

function getDayIndex(dayName) {
    const days = {
        "Saturday": 6,
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5
    };
    return days[dayName];
};

function selectDay(button, dayName, currentDoctorId) {
    let currentDoctor = doctorsList.find(doctor => doctor.id === currentDoctorId);

    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('selected'));


    button.classList.add('selected');

    let today = new Date();
    let selectedDate = new Date();
    selectedDate.setDate(today.getDate() - today.getDay() + getDayIndex(dayName));

    // // Format the selected date
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = selectedDate.toLocaleDateString('ar', options);
    console.log("this is formattedDate", formattedDate);
    document.getElementById('selectedDate').innerText = formattedDate;
    // //  UNIX timestamp
    document.getElementById('date').value = selectedDate.getTime();
    console.log("this is selectedDate", selectedDate);
    showAvailableSlot(dayName, currentDoctor, selectedDate.getTime());
}

function showAvailableSlot(dayName, currentDoctor, date) {

    let aslots = $('#aslots');
    aslots.empty();

    let slots = currentDoctor.time_slots.filter(slot => slot.weekday === dayName);

    slots.forEach(slot => {
        let isBooked = currentDoctor.appointment.some(app => app.date === date && app.time_slot === `${slot.s_time} To ${slot.e_time}`);
        if (!isBooked) {
            let optionText = `${slot.s_time} To ${slot.e_time}`;
            aslots.append(new Option(optionText, optionText));
        }
        else {
            console.log('Slot already booked:🛑', slot.s_time);
        }
    });


    if (slots.length > 0) {
        aslots.show();
    } else {
        aslots.hide();
    }
}

function bookAppointment() {
    // show loading spinner
    const loadingSpinner = document.getElementById("loading");
    loadingSpinner.style.display = "block";

    const nationalId = document.getElementById("national_id").value ?? document.getElementById("p_national_id").value //p_national_id ;
    const patientId = document.getElementById("patient_id").value;
    const doctorId = document.getElementById("doctor-id").value;
    const visitDescriptionId = document.getElementById("visit_description").value;
    const visitCharges = document.getElementById("visit_charges").value;
    const date = document.getElementById("date").value;
    const timeSlot = document.getElementById("aslots").value;

    const patientName = document.getElementById("patient_name")?.value ?? '';
    const patientPhone = document.getElementById("patient_phone")?.value ?? '';
    const patientEmail = document.getElementById("patient_email")?.value ?? '';
    const patientGender = document.getElementById("patient_gender")?.value ?? '';
    const patientAge = document.getElementById("patient_age")?.value ?? '';
    const remarks = document.getElementById("remarks")?.value ?? '';
    const depositType = "Cash";
    const amountReceived = visitCharges;
    const payNowAppointment = false;
    const discount = 0;
    const body = {
        "patient": patientId,
        "doctor": doctorId,
        "date": date, // UNIX appointment date
        "time_slot": timeSlot,
        "remarks": remarks,
        "visit_description": visitDescriptionId,

        // required if "patient" == "add_new"
        "p_name": patientName,
        "p_email": patientEmail,
        "p_phone": patientPhone,
        "p_age": patientAge,
        "p_gender": patientGender,
        "p_national_id": nationalId,

        // required for "payment" table
        "discount": 0,
        "deposit_type": "Cash",

        // required if pay now appointment
        // "pay_now_appointment": true,
        "amount_received": amountReceived
    };
    console.log("this is body", body);

    const apiUrl = `${path}/book-appointment`;
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic cGNtYzpFQHN5RG9jQHBjbWM="
        },
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(body)
    }).then(async response => {
        console.log("this is response", response);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        let result = await response.json()
        if (result.result != 'error') {
            // hide loading spinner
            loadingSpinner.style.display = "none";
            // hide form and show success message
            document.getElementById("addAppointmentForm").style.display = "none";
            document.getElementById("successMessage").style.display = "block";

            // hide the modal
            // $("#exampleModal").modal("hide");
        }


    });
}