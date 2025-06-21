use candid::{CandidType, Deserialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Clone)]
pub struct Student {
    pub name: String,
    pub marks: Vec<u32>,    // each subject's mark
    pub max_mark: u32,      // max mark per subject
}

thread_local! {
    static STUDENTS: RefCell<HashMap<String, Student>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
fn add_student(name: String, marks: Vec<u32>, max_mark: u32) {
    let student = Student {
        name: name.clone(),
        marks,
        max_mark,
    };
    STUDENTS.with(|s| s.borrow_mut().insert(name, student));
}

#[ic_cdk::update]
fn delete_student(name: String) {
    STUDENTS.with(|s| s.borrow_mut().remove(&name));
}

#[ic_cdk::query]
fn get_student(name: String) -> Option<Student> {
    STUDENTS.with(|s| s.borrow().get(&name).cloned())
}

#[ic_cdk::query]
fn list_students() -> Vec<Student> {
    STUDENTS.with(|s| s.borrow().values().cloned().collect())
}
