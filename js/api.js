let doctorsList = [];

document.addEventListener("DOMContentLoaded", async () => {
    await fetchDoctors();
});

const path = "https://api.easydoc.sa/his/pcmc";


console.log("this is start hellow :)");

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
        doctorsList = doctors.rows; // Assign the fetched doctors to the global variable
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
    const container = document.querySelector(".pricing-area .row");
    container.innerHTML = "";

    doctors.forEach(doctor => {
        const doctorBox = document.createElement("div");
        doctorBox.classList.add("col-lg-4", "col-md-12");

        const doctorProfile = doctor.profile ? doctor.profile.replace(/<\/?[^>]+(>|$)/g, "") : "لا يوجد وصف متاح";

        let scheduleHTML = "<h5>الأوقات المتاحة</h5><ul class='d-flex flex-wrap'>";
        if (doctor.time_schedule && doctor.time_schedule.length > 0) {
            doctor.time_schedule.forEach(slot => {
                scheduleHTML += `<li class="bg-white rounded-pill p-1 m-1">${translateWeekday(slot.weekday)}</li>`;
            });
        } else {
            scheduleHTML += "<li>لا يوجد جدول زمني متاح</li>";
        }
        scheduleHTML += "</ul>";

        // Construct doctor card
        doctorBox.innerHTML = `
            <div class="pricing-box text-center mb-60 pt-3">
                <div class="row align-items-center">
                    <div class="col-3">
                        <img class="rounded-circle border border-primary" src="https://his.easydoc.sa/${doctor.img_url}" alt="doctor-image">
                    </div>
                    <div class="col-9 text-right">
                        <h4>${doctor.name}</h4>
                        <div class="price-count mb-30">
                            <h2>${doctor.department_name || "طبيب"}</h2>
                        </div>
                    </div>
                </div>
                <div class="pricing-body text-right p-3">
                    <p>${doctorProfile}</p>
                    ${scheduleHTML}
                </div>
                <div class="pricing-btn">
                    <a class="btn book-now-btn" 
                       data-doctor-id="${doctor.id}" 
                       data-doctor-name="${doctor.name}">إحجز الأن <i class="fas fa-chevron-right"></i></a>
                </div>
            </div>
        `;

        container.appendChild(doctorBox);
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
    $(document).ready(function () {
        $(".book-now-btn").click(function () {
            // Get doctor data from button attributes
            let doctorId = $(this).data("doctor-id");
            let doctorName = $(this).data("doctor-name");
            let currentDoctor = doctorsList.find(doctor => doctor.id === doctorId);
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