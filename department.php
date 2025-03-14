<!doctype html>
<html class="no-js" lang="ar" dir="rtl">
<!-- rtl -->

<head lang="ar">
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title> مركز الرعاية الاولية </title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico">
    <!-- Place favicon.ico in the root Internist, General Practitonery -->

    <!-- CSS here -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/animate.min.css">
    <link rel="stylesheet" href="css/magnific-popup.css">
    <link rel="stylesheet" href="fontawesome/css/all.min.css">
    <link rel="stylesheet" href="css/dripicons.css">
    <!-- <link rel="stylesheet" href="css/slick.css"> -->
    <link rel="stylesheet" href="css/default.css">
    <link rel="stylesheet" href="css/meanmenu.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    <style>
        body {
            margin: 0 auto;
        }

        .modal-dialog {
            margin-top: 10vh !important;
            /* Adjust this if needed */
        }

        .modal {
            z-index: 1055 !important;
        }

        .modal-backdrop {
            z-index: 1050 !important;
        }

        .department-item {
            height: 100%;
            width: 100%;
            text-align: center;
            margin: 10px 0;
        }

        .icon img {
            width: 60px;
            height: auto;
            margin-bottom: 20px;
        }

        .wame {
            background-color: #25d366;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .day-btn {
            flex: 1;
            text-align: center;
            border: none;
            font-weight: bold;
            cursor: pointer;
            /* font-size: 14px !important; */
            color: #013243 !important;
        }

        .day-btn p {
            padding: 0 !important;
            margin: 0 !important;
        }

        .day-btn.selected {
            background-color: #013243 !important;
            color: white !important;

        }
    </style>
</head>

<body>
    <?php include 'layouts/header.php'; ?>
    <!-- main-area -->
    <main>

        <section id="pricing" class="pricing-area pb-70"
            style="background-image: url(img/an-bg/an-bg08.png);background-position: center; background-repeat: no-repeat;">
            <div class="container">

                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="section-title center-align mb-60 text-center">
                            <br>
                            <h2 id="department_name">اطبائنا المتميزين</h2>
                            <p>
                                تطمن على صحتك وخذ الخطوة الاولى للعلاج
                        </div>
                    </div>
                </div>
                <div class="row" id="doctors">
                    <div id="loading">جاري التحميل ...</div>

                </div>
            </div>
        </section>

    </main>
    <!-- main-area-end -->
    <?php include 'layouts/footer.php'; ?>


    <?php include 'whatsapp.php' ?>

    <section>
        <div class="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

            <div class="modal-dialog" role="document">
                <div class="modal-content  text-white">
                    <div class="modal-header appointment_modal_header">
                        <h5 class="modal-title font-weight-bold" id="exampleModalLabel">حجز الموعد</h5>
                        <button type="button" class="close modal_close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body appointment_modal_body">
                        <!-- add loading -->
                        <div id="loading" class="d-none position-fixed top-50 start-50 translate-middle">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        <div class="successMessage" style="display:none" id="successMessage">

                            <div class="alert alert-success d-flex flex-column align-items-center text-center"
                                role="alert">
                                <i class="fas fa-check-circle fa-2x mb-2"></i>
                                <span>تم حجز الموعد بنجاح</span>
                            </div>
                        </div>
                        <form id="addAppointmentForm">
                            <!-- add error validation -->
                            <label for="patient">
                                <h5 class="text-primary text-right"> الملف الطبي</h5>
                            </label>
                            <select class="form-control rounded-pill rounded-pill" id="patient" name="patient">
                                <option value="">إختر</option>
                                <option value="patient_id">لدي ملف</option>
                                <option value="add_new">فتح ملف جديد</option>
                            </select>
                            <div id="patientIdField" style="display:none;">
                                <label for="patient_id">
                                    <h5 class="text-primary text-right">رقم الهوية</h5>
                                </label>
                                <input type="text" class="form-control rounded-pill" onkeyup="searchByNationalId();"
                                    id="national_id" name="national_id" placeholder="ادخل رقم الهوية">

                                <div id="searchResult"></div>
                                <div id="patient-details"></div>

                            </div>
                            <div id="patientDetails" style="display:none;">
                                <input type="hidden" id="patient_id" value="add_new">

                                <label for="p_name">
                                    <h5 class="text-primary text-right">اسم المراجع</h5>
                                </label>
                                <input type="text" class="form-control rounded-pill" name="p_name" id="patient_name">
                                <label for="p_national_id">
                                    <h5 class="text-primary text-right">رقم هوية المراجع</h5>
                                </label>
                                <input type="text" class="form-control rounded-pill" name="p_national_id"
                                    id="p_national_id">
                                <label for="p_email">
                                    <h5 class="text-primary text-right">البريد الالكتروني</h5>
                                </label>
                                <input type="email" class="form-control rounded-pill" name="p_email" id="patient_email">
                                <label for="p_phone">
                                    <h5 class="text-primary text-right">رقم الهاتف</h5>
                                </label>
                                <input type="text" class="form-control rounded-pill" name="p_phone" id="patient_phone">
                                <label for="p_gender">
                                    <h5 class="text-primary text-right">الجنس</h5>
                                </label>
                                <select class="form-control rounded-pill" name="p_gender" id="patient_gender">
                                    <option value="Male">رجل</option>
                                    <option value="Female">إمرأة</option>
                                </select>
                            </div>

                            <label for="doctor" class="pt-3">
                                <h5 class="text-primary text-right">الطبيب</h5>
                            </label>
                            <input type="text" class="form-control rounded-pill" id="dr-name" name="dr-name"
                                value="د. مجاهد" readonly>
                            <input type="hidden" id="doctor-id" name="doctor-id">
                            <label for="date" class="pt-3">
                                <h5 class="text-primary text-right">اختر اليوم</h5>
                            </label>
                            <div class="weekday-picker bg-light flex-d  p-0 m-0" id="weekday-picker">
                                <!-- will updated  -->
                            </div>
                            <h5 class="mt-3 text-primary">التاريخ المختار: <span id="selectedDate">لايوجد</span></h5>
                            <input type="hidden" id="date" name="date">
                            <label for="aslots" class="pt-3">
                                <h5 class="text-primary text-right">الوقت المتاح</h5>
                            </label>
                            <select class="form-control rounded-pill" name="time_slot" id="aslots"></select>
                            <label for="visit_description" class="pt-3">
                                <h5 class="text-primary text-right">نوع الزيارة</h5>
                            </label>
                            <select class="form-control rounded-pill" name="visit_description"
                                id="visit_description"></select>
                            <label for="remarks" class="pt-3">
                                <h5 class="text-primary text-right">ملاحظة</h5>
                            </label>
                            <input type="text" class="form-control rounded-pill" id="remarks" name="remarks">
                            <label for="visit_charges" class="pt-3">
                                <h5 class="text-primary text-right">سعر الاستشارة</h5>
                            </label>
                            <input type="number" class="form-control rounded-pill " name="visit_charges"
                                id="visit_charges" min="0" readonly>

                            <!-- <input type="checkbox" id="pay_now_appointment " name="pay_now_appointment"
                                value="pay_now_appointment">
                            <label for="pay_now_appointment">إدفع الان</label> -->

                            <button type="button" class="btn btn-primary mt-3 float-right" onclick="bookAppointment()">
                                تأكيد الحجز
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- JS here -->
    <!-- JS here -->
    <script src="js/vendor/jquery-1.12.4.min.js"></script>
    <script src="js/vendor/modernizr-3.5.0.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/one-page-nav-min.js"></script>
    <script src="js/jquery.meanmenu.min.js"></script>
    <!-- <script src="js/slick.min.js"></script> -->
    <script src="js/ajax-form.js"></script>
    <script src="js/paroller.js"></script>
    <script src="js/wow.min.js"></script>
    <script src="js/js_isotope.pkgd.min.js"></script>
    <script src="js/imagesloaded.min.js"></script>
    <script src="js/parallax.min.js"></script>
    <script src="js/jquery.waypoints.min.js"></script>
    <script src="js/jquery.counterup.min.js"></script>
    <script src="js/jquery.scrollUp.min.js"></script>
    <script src="js/parallax-scroll.js"></script>
    <script src="js/jquery.magnific-popup.min.js"></script>
    <script src="js/element-in-view.js"></script>
    <script src="js/main.js"></script>
    <script src="js/api.js"></script>
    <script>
        departmentInit();

        $(document).ready(function () {
            $("#patient").change(function () {
                if ($(this).val() === "add_new") {
                    $("#patientDetails").slideDown();
                    $("#patientIdField").slideUp();

                } else if ($(this).val() === "patient_id") {
                    $("#patientIdField").slideDown();
                    $("#patientDetails").slideUp();
                } else {
                    $("#patientDetails").slideUp();
                    $("#patientIdField").slideUp();
                }
            });
        });
    </script>

</body>


</html>