/* HIZVENA V18: explicit choice → requirements → review. No uploads/persistence/backend. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const flows={};
function setup(formId,kind,selectorId){
 const form=$(formId),select=$(selectorId);if(!form||!select)return;
 const field=select.closest('label');if(!field)return;
 const sourceFields=form.querySelector('.fields');if(!sourceFields)return;
 const stage1=document.createElement('div'),stage2=document.createElement('div');
 stage1.className='v18-wizard v18-choice';stage2.className='v18-wizard v18-details';stage2.hidden=true;
 stage1.setAttribute('aria-label','Tahap 1: Pilih layanan');stage2.setAttribute('aria-label','Tahap 2: Detail kebutuhan');
 const heading=document.createElement('h4');heading.textContent='Pilih Layanan';
 const note=document.createElement('p');note.className='v18-wizard-stepnote';note.textContent='TAHAP 1 DARI 3';
 const explain=document.createElement('p');explain.textContent='Pilih layanan yang sesuai, lalu lanjutkan untuk melengkapi kebutuhan.';
 const actions=document.createElement('div');actions.className='v18-wizard-actions';
 const next=document.createElement('button');next.className='btn';next.type='button';next.textContent='Lanjutkan';
 stage1.append(note,heading,explain,field);actions.append(next);stage1.append(actions);
 const step2Header=document.createElement('p');step2Header.className='v18-wizard-stepnote';step2Header.textContent='TAHAP 2 DARI 3';
 const step2Title=document.createElement('h4');step2Title.textContent='Lengkapi Kebutuhan';
 const back=document.createElement('button');back.type='button';back.className='btn secondary v18-back';back.textContent='Kembali ke Pilihan Layanan';
 stage2.append(step2Header,step2Title,back);
 // Move existing form fields into the second panel; preserve bound handlers and entered values.
 const parts=[...form.children];const start=parts.indexOf(sourceFields);
 // Academic forms insert name/phone/status before fields at runtime.
 const academicContact=kind==='academic'?form.querySelector('.contact-fields'):null;
 const insertionPoint=academicContact||sourceFields;
 form.insertBefore(stage1,insertionPoint);
 form.insertBefore(stage2,insertionPoint);
 const move=[...form.children].filter(el=>el!==stage1&&el!==stage2&&
   (el===sourceFields||el===academicContact||el.id==='campusDatasetStatus'||el.classList.contains('hint')||
    el.matches('button[type="submit"]')||el.id==='designPreview'));
 for(const node of move)stage2.append(node);
 // Staged form must not validate required hidden stage-one fields when reviewing stage two.
 const openDetails=()=>{
  if(!select.value){select.setCustomValidity('Pilih jenis layanan dahulu.');select.reportValidity();return false}
  select.setCustomValidity('');stage1.hidden=true;stage2.hidden=false;
  step2Title.setAttribute('tabindex','-1');step2Title.focus();return true;
 };
 const showChoice=()=>{stage2.hidden=true;stage1.hidden=false;heading.setAttribute('tabindex','-1');heading.focus()};
 next.addEventListener('click',openDetails);back.addEventListener('click',showChoice);
 select.addEventListener('change',()=>select.setCustomValidity(''));
 form.addEventListener('reset',showChoice);
 flows[kind]={openDetails,showChoice};
}
setup('consultForm','academic','service');
setup('designConsultForm','design','designType');
window.HizvenaWizard={openDetails:kind=>flows[kind]?.openDetails(),showChoice:kind=>flows[kind]?.showChoice()};
})();
