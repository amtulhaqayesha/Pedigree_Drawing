//sessionStorage.AS_IMAGENAME = 'Family Pedigree';
//sessionStorage.DATA1_PATID = '677764';
//sessionStorage.CONTRACT_EPISODE_NO = '';

var ID_Seq = 0;

$(document).ready(function () {
    f_retrieve();

    f_initialize_for_touch();
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', ev.target.id);
}

function drop(ev) {

    ev.preventDefault();

    var a = document.getElementById(ev.dataTransfer.getData('text/plain'));
    if (a.getAttribute("clone") == "yes") {
        if (a.id == "Textbox") {
            a = document.createElement("INPUT");
            a.setAttribute("type", "text");
            a.setAttribute("draggable", true);
            a.addEventListener("dragstart", drag);
            //a.style.border = 'none';
            a.focus();
            a.select();
        }
        else
            a = a.cloneNode(true);
    }
    a.id = ID_Seq++;
    a.style.position = 'absolute';
    a.style.zIndex = 1000;
    a.style.left = (ev.offsetX - 10) + 'px';
    a.style.top = (ev.offsetY - 10) + 'px';
    
    a.setAttribute('clone', 'no');
    
    a.ondblclick = function (event) {
        a.remove();
    };

    ev.target.appendChild(a);
}



function f_printDiv(div) {
    html2canvas((div), {
        onrendered: function (canvas) {           
            var img = canvas.toDataURL();            

            var wintitle = $("#clinimagetitle").text() + ": " + $("#patname").text();
            var winhead = '<head><title>' + wintitle + '</title></head>';
            var winbody = '<body><img src="' + img + '"></body>';
            myWindow = window.open('', 'MyNewWindow', '');
            myWindow.document.write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html>' + winhead + winbody + '</html > ');
            myWindow.document.close();
        }
    });
}

function f_retrieve() {

    var ls_patname, ls_type;
    //iwin = awin
    //String ls_imagetype, ls_dtoname, ls_patname, ls_filename, ls_pathname, ls_path, ls_type
    //Int li_rowcount, li_file_num
    var lblb_pic = '';
    //Boolean lb_exist = false
    //dw_title.SetTransobject(SQLCA)
    var url = location.origin + "/eSystem-API/api/w_clinimage/co_clinimage/f_getclinimagetype/" + sessionStorage.loggedindatabasename + '/' + sessionStorage.AS_IMAGENAME;
  
    $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data.length > 0) {

                $("#clinimagetitle").text(data[0].CLINIMAGE_TITLE);
                var ls_imagetype = data[0].CLINLIMAGE_TYPE;
                //is_path = GetCurrentDirectory()
                //il_episodeno = contract.episode_no
                //is_patid = data1.patid

                //clinimage_title
                $("#is_imagetype").val(ls_imagetype);
                var url = location.origin + "/eSystem-API/api/w_clinimage/co_clinimage/f_getPatinfo/" + sessionStorage.loggedindatabasename + '/' + sessionStorage.DATA1_PATID;
               
                $.ajax({
                    type: 'GET',
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    dataType: 'json',
                    cache: false,
                    success: function (result) {
                        ls_patname = result;
                    }
                }).fail(function (xhr, textStatus, err) {
                    custom_msgBox(xhr.statusText, xhr.responseText, "OK", "StopSign", function () { });

                });

                if (ls_imagetype == 'DATW')
                    ls_type = 'FD';
                else
                    ls_type = 'INKP';

                $("#patid").text('[' + sessionStorage.DATA1_PATID + ']');
                $("#patname").text(ls_patname);
                var is_imagelocation = f_gethosprule(sessionStorage.loggedindatabasename, sessionStorage.loggedinHosp_Code, "DR_IMAGELOCATION");

                var url = location.origin + "/eSystem-API/api/w_clinimage/co_clinimage/f_getclinlimage/" + sessionStorage.loggedindatabasename + '/' + sessionStorage.DATA1_PATID + '/' + ls_type;

                $.ajax({
                    type: 'GET',
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    dataType: 'json',
                    cache: false,
                    success: function (data2) {
                        if (data2.length > 0) {
                            lblb_pic = data2[0].CLINIMAGE;
                            $("#drawingboard").html(data2[0].CLINIMAGE_HTML_WEB);
                            //The controls do not have the dblclick event added. So add it now
                            var elements = $("#drawingboard").find("div,input[clone='no']");                           
                            elements.each(function (index, item) {
                                $(item).on("dblclick", function (e) { $(item).remove(); });
                                //We have to get the maximum ID of saved elements so that ID_Seq can be initialized appropriately
                               
                                var id = $(item).attr("id");
                                if ($.isNumeric(id))
                                {
                                    if (ID_Seq < id)
                                        ID_Seq = id;
                                }
                                
                            });
                            
                            ID_Seq++;
                        }
                    }
                }).fail(function (xhr, textStatus, err) {
                    custom_msgBox(xhr.statusText, xhr.responseText, "OK", "StopSign", function () { });

                });

                switch (ls_imagetype) {
                    case 'DATW':
                        if (lblb_pic.length > 0) {
                            $("#imgclinimage").attr("src", "data:image/png;base64," + lblb_pic);
                        }
                        break;

                    //ls_dtoname = dw_title.Object.dto_name[1]
                    //dw_1.Dataobject = ls_dtoname
                    //is_dataobject = ls_dtoname
                    //dw_1.SetTransobject(SQLCA)
                    //f_resolution_control(iwin, dw_1)
                    //dw_1.Insertrow(0)
                    //dw_1.show()
                    //If Not IsNull(lblb_pic) then

                    //dw_1.SetFullState(lblb_pic)
                    //dw_1.SetTransobject(SQLCA)
                    //f_resolution_control(iwin, dw_1)
                    //End If
                    case 'INKP':
                        //SELECTBLOB  CLINIMAGE
                        //                    INTO: lblb_pic
                        //                    FROM PATIENT_CLINLIMAGES
                        //                    WHERE patid = :data1.patid
                        //                    and episode_no = :contract.episode_no;

                        //                    if len(lblb_pic) > 0  then		
                        //                    lb_exist = FileExists(is_imagelocation)
                        //                    If lb_exist = false then
                        //                    CreateDirectory(is_imagelocation)
                        //                    End If				
                        //                    ls_filename = '\'+is_patid + '_'+string(il_episodeNo) + '.png'
                        //                    ls_pathname = is_imagelocation + ls_filename
                        //                    is_pathname = ls_pathname
                        //                    FileDelete(ls_pathname)
                        //                    li_file_num = fileopen(ls_pathname, streammode!, write!, shared!, replace!)
                        //                    filewriteex(li_file_num, lblb_pic)
                        //                    FileClose(li_file_num)
                        //                    lb_exist = FileExists(ls_pathname)
                        //                    If lb_exist = true then
                        //                    ip_1.PicturefileName = ls_pathname
                        //                    //p_1.picturename= ls_pathname
                        //                    //p_1.visible = true

                        //                    End If			
                        //                    Else
                        //                    ip_1.picturefilename = is_path + "\kidney_stone.png"
                        //                    End If


                        //                    ip_1.visible = true
                        //                    dw_button.Object.p_print.visible = '0'
                        //                    dw_button.Object.t_print.visible = '0'
                        break;
                }
            }

        }
    }).fail(function (xhr, textStatus, err) {
        custom_msgBox(xhr.statusText, xhr.responseText, "OK", "StopSign", function () { });

    });
}

function f_btn_clicked(id) {
    //Int li_count, li_row, li_file
    //Long ll_maxid
    //Blob lb_temp, lb_pic, lblb_pic
    //Boolean lb_exist = false
    //string ls_pathname, ls_filename
    //Datastore ds_temp, ds_print
    //ds_print = create datastore
    //ds_print.Dataobject = 'd_clinimage_familydigree_print'
    //ds_print.SetTransObject(SQLCA)
    //ds_temp = create datastore
    //ds_temp.Dataobject = 'd_clinimage_ds'
    //ds_temp.SetTransObject(SQLCA)


    switch (id) {
        case 'clear':
            ID_Seq = 0;
            $("#drawingboard").html('');
            break;

        case 'print':
            f_printDiv($("#drawingboard"));
            break;
            
        case 'save':
            switch ($("#is_imagetype").val()) {
                case 'INKP':
                    //lb_exist = FileExists(is_imagelocation)
                    //                If lb_exist = false then
                    //                CreateDirectory(is_imagelocation)
                    //                End If		

                    //                ls_filename = '\'+is_patid + '_'+string(il_episodeNo) + '.png'
                    //                ls_pathname = is_imagelocation + ls_filename
                    //                ip_1.save(ls_pathname, 4, TRUE)

                    //                li_file = FileOpen(ls_pathname, StreamMode!, read!, shared!)

                    //                IF li_file <> -1 THEN
                    //                //set blob 
                    //                do while FileRead(li_file, lb_temp) > 0
                    //		lb_pic = lb_pic + lb_temp
                    //	loop
                    //	FileClose(li_file)
                    //                END IF	

                    //                select count(*) Into : li_count from PATIENT_CLINLIMAGES where patid = :data1.patid and episode_no = :il_episodeno;
                    //                If IsNull(li_count) or li_count = 0 then
                    //                select Max(PATIENT_CLINLIMAGES_ID) into : ll_maxid from PATIENT_CLINLIMAGES;
                    //                If IsNull(ll_maxid) or ll_maxid = 0 then ll_maxid = 1000
                    //                ll_maxid++

                    //                li_row = ds_temp.Insertrow(0)

                    //                ds_temp.Object.PATIENT_CLINLIMAGES_ID[li_row] = ll_maxid
                    //                ds_temp.Object.CLINLIMAGE_TYPE[li_row] = 'INKP'
                    //                ds_temp.Object.episode_no[li_row] = contract.episode_no
                    //                ds_temp.Object.patid[li_row] = data1.patid
                    //                ds_temp.Object.amend_by[li_row] = gv_userid
                    //                ds_temp.Object.amend_date[li_row] = f_today()

                    //                ds_temp.Update()
                    //                UpdateBlob PATIENT_CLINLIMAGES
                    //                Set CLINIMAGE = :lb_pic
                    //                Where PATIENT_CLINLIMAGES_ID = :ll_maxid;
                    //                commit;
                    //                FileDelete(ls_pathname)
                    //                Msgbox("70")
                    //                Else
                    //                UpdateBlob PATIENT_CLINLIMAGES
                    //                Set CLINIMAGE = :lb_pic
                    //                Where patid = :data1.patid
                    //                and episode_no = :il_episodeno;
                    //                commit;
                    //                FileDelete(ls_pathname)
                    //                Msgbox("70")
                    //                End If				
                    break;
                default:
                    var div = $("#drawingboard");
                    //before saving, fetch the textboxes and if they have text, set it as the value of the input. Else when the HTML is saved, the text will not be saved.
                    var elements = $("#drawingboard").find("input[type='text']");
                    elements.each(function (index, item) {                        
                        var textboxval = $(item).val();
                       
                            var textboxHTML = item.outerHTML;
                            var indexOfValueAttr = textboxHTML.indexOf('value="');
                            if (indexOfValueAttr != -1)//value attribute was present when the page loaded. We have to update the value
                            {
                                var updatedHTML = textboxHTML.substring(0, indexOfValueAttr) + ' value="' + textboxval + '">';
                                var newTextbox = $(updatedHTML);
                                $(item).replaceWith(newTextbox);
                            }
                            else {//add the value now
                                var updatedHTML = textboxHTML.substring(0, textboxHTML.length - 1) + ' value="' + textboxval + '">';
                                var newTextbox = $(updatedHTML);
                                $(item).replaceWith(newTextbox);                                
                            }
                    });

                    

                    html2canvas((div), {
                        onrendered: function (canvas) {

                            var imgsrc = canvas.toDataURL();
                            var parts = imgsrc.split(';base64,');

                            var url = location.origin + "/eSystem-API/api/w_clinimage/co_clinimage/f_clinlimage_save";
                            var pData = {
                                DATABASENAME: sessionStorage.loggedindatabasename,
                                PATID: sessionStorage.DATA1_PATID,
                                EPISODE_NO: sessionStorage.CONTRACT_EPISODE_NO,
                                USERID: sessionStorage.loggedinuserid,
                                CLINIMAGE: parts[1],
                                CLINIMAGE_HTML_WEB: $("#drawingboard").html()
                            };

                            //console.log(url);
                            //console.log(JSON.stringify(pData));

                            $.ajax({
                                type: 'POST',
                                url: url,
                                contentType: "application/json; charset=utf-8",
                                async: false,
                                dataType: 'json',
                                data: JSON.stringify(pData),
                                cache: false,
                                success: function (result) {
                                   
                                    if (result == "Success")
                                        Show_Message_Box("70", "", function () { });
                                    else
                                        alert(result);
                                }
                            }).fail(function (xhr, textStatus, err) {
                                custom_msgBox(xhr.statusText, xhr.responseText, "OK", "StopSign", function () { });

                            });
                        }
                    });
                    break;
            }
    }
}


//**********************For Touch Devices***********************************************
//In touch devices dragstart and drop events are not present

function handleTouchEnd(ev) {
    ev.preventDefault();

    var touch = ev.changedTouches[0];


    var a = document.getElementById(this.id);
    if (a.getAttribute("clone") == "yes") {

        if (a.id == "Textbox") {
            a = document.createElement("INPUT");
            a.setAttribute("type", "text");
            a.addEventListener("touchend", handleTouchEnd, false);
            //a.style.border = 'none';
        }
        else
            a = a.cloneNode(true);
    }
    a.id = ID_Seq++;
    a.style.position = 'absolute';
    a.style.zIndex = 1000;

    var board = document.getElementById("drawingboard");
    a.style.left = (touch.clientX - board.offsetParent.offsetLeft) + 'px';
    a.style.top = (touch.clientY - board.getBoundingClientRect().top) + 'px';
    a.setAttribute('clone', 'no');

    a.addEventListener("touchend", handleTouchEnd, false);

    //a.ondblclick = function (event) {
    //    a.remove();
    //};

    document.getElementById("drawingboard").appendChild(a);
}

function f_initialize_for_touch()
{
    var draggableelements = [...document.querySelectorAll('[draggable="true"]')];
    for (var i = 0; i < draggableelements.length; i++) {
        var element = document.getElementById(draggableelements[i].id);
        element.addEventListener("touchend", handleTouchEnd, false);
    }
}






