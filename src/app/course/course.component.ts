import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay,
    first
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import { Store } from '../common/store.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId:number;

    course$ : Observable<Course>;

    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute, private store:Store) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        // this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
        // we are now getting the information from the in-memory store.
        // since its data that doesn't change very often.
        this.course$ = this.store.selectCourseById(this.courseId)
        // this observable will never complete, because it is derived from the courses$ observable (in store.service.ts)
        // if we would like to force the completion of an existing observable, we can use the first() or take() operators
        // the first() operator produces a derived stream that emits only the first value of the derived stream and then completes
        // the take() operator, for example take(3), produces a derived stream taht emits the third value of the derived
        // stream and then completes
            .pipe(
                first()
            );

        // withLatestFrom rxjs operator
        // The withLatestFrom operator, is useful when dealing with long running observables
        // we call the loadLessons() method which will get us an observable after making a backend call
        // after we get the lessons, we can combine it with withLatestFrom the long running course$ observable
        // so we obtain the course data, combining observables together by taking the latest value provided by the course observable
        // this emits a tuple containing two things: 1) the lessons (source) observable output, and 
        // 2) the latest value (course) from the course observable
        // so withLatestFrom is about combining the current value of an observable with the latest value emitted by one or more 
        // observables (in this case only one - the course observable)
        this.loadLessons()
            .pipe(
                withLatestFrom(this.course$)
            )
            .subscribe(([lessons, course]) => {
                console.log("lessons", lessons);
                console.log("course", course);
            })

    }

    ngAfterViewInit() {

        const searchLessons$ =  fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search))
            );

        const initialLessons$ = this.loadLessons();

        this.lessons$ = concat(initialLessons$, searchLessons$);

    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(
            `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res["payload"])
            );
    }


}



// remember that to start to start the node project you do "npm start" -> this will load in a browser in localhost:4200 or something like that
// and to start the server you do "npm run server" -> this will start the server, i think it may be accessible in localhost:9000 in the browser, or something like that







