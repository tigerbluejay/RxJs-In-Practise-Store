import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject } from 'rxjs';
import {Course} from '../model/course';
import {map, tap } from 'rxjs/operators';
import {createHttpObservable } from './util';
import { fromPromise } from 'rxjs/internal-compatibility';

/* We put subjects to a practical use by implementing a "Centralized Store"
Every time we go to home component we trigger an api request to fetch the courses
When we navigate to another route and we go back, the api request is made again.
We would like instead to store the fetched data, a central place in memory in the client
Whenever the data is needed, we just subscribe to it.
We create this service, which exposes the observables, providing the data to the application */

@Injectable({
    // this configuration means that there is only one store for the whole application
    providedIn: 'root'
})
export class Store {
    // we use a subject to create this observable
    // we make it private so only this class has the ability of emitting values for this observable
    // late subscribers also should get the latest emitted value (when we naviagate out of the home component)
    // when we get back to the home component, we also want them to get the data,
    // so we use the BehaviorSubject Subject.
    private subject = new BehaviorSubject<Course[]>([]);

    // this is where we'll store the data
    // with asObservable we derive the subject
    courses$ : Observable<Course[]> = this.subject.asObservable();

    // we fetch the data on initalization and make it available to the rest of the application
    init() {
        // here we are calling the endpoint, and receiving an observable
        const http$ = createHttpObservable('/api/courses');

        http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"]))
            )
            .subscribe(
                courses => this.subject.next(courses)
            );
    }

    selectBeginnerCourses() {
        return this.filterByCategory('BEGINNER');
    }

    selectAdvancedCourses() {
        return this.filterByCategory('ADVANCED');

    }

    filterByCategory(category:string) {
        return this.courses$
        .pipe(
            map(courses => courses
                    .filter(course => course.category == category))
            );

    }

    // when we hit save, we emit a new value so that the changes we make to the course in memory
    // are reflected in the rest of the application
    saveCourse(courseId:number, changes): Observable<any> {
        const courses = this.subject.getValue();
        // loop through all the courses and find the course index that matches the id we passed
        const courseIndex = courses.findIndex(course => course.id == courseId);
        // we don't modify the value directly, we create a copy "newCourses"
        // to make sure the application components understand that changes have occurred
        const newCourses = courses.slice(0);

        // we create a new course object and fill it out by copying the course with the right
        // index, and then modify this copy with the changes we have received 
        // we use the spread operator
        newCourses[courseIndex] = { ...courses[courseIndex], ...changes};

        // we broadcast the changes to the rest of the application
        this.subject.next(newCourses);

        // we make a request to the backend and save the changes to the backend
        return fromPromise(fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));

    }



}