import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, BehaviorSubject, AsyncSubject, ReplaySubject} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {

        // // // Subjects: It's better to create observables with "observable.create" or "fromPromise" or "of" or "from"
        // // // However, if some of those methods are not convenient, or if we run into a source of data that is not easily transformable into an observable
        // // // or if we are doing multicasting of one value to multiple separate observable consumers, we might want to look at Subjects

        // // // Subject: It's at the same time an observer and an observable. We can emit values with it, but we can also combine it with other observables.
        // // const subject = new Subject();
        // // // we create an observable out of the subject
        // // const series$ = subject.asObservable(); // gets us back an observable that we can assign to variable series
        // // series$.subscribe(console.log); // we subscribe and log values to the console

        // // // here we emit 3 values 
        // // subject.next(1);
        // // subject.next(2);
        // // subject.next(3);
        // // subject.complete();

        // // When we need to use Subjects, we will not use Subject, but BehaviorSubject, 
        // // because it supports late subscriptions.
        // // it is the most commonly used type of Subject
        
        // // even if subscription happens late we still want to get the latest value emitted by the observable before the subscription
        // // the goal of behaviorSubject is to always provide something to subscribers
        // const subject = new BehaviorSubject(0); // we pass in initial value 0
        // const series$ = subject.asObservable();
        // series$.subscribe(val => console.log("early sub:" + val));

        // subject.next(1);
        // subject.next(2);
        // subject.next(3);

        // setTimeout(() => {
        //     series$.subscribe(val => console.log("late sub:" + val));
        //     // both subscribers will receive the value "4": early and late subscribers will receive it
        //     subject.next(4) // value 4 is being emitted after both subscriptions take place
        // }, 3000);


        // // AsyncSubject: Ideal for long running calculations. Where we have an observable emitting lots
        // // of internmediate calculations. We don't want to receive the intermediate value of the calculation,
        // // only the last value. Completion is essential. Both the first and second subscriber receive the last
        // // value.

        // const subject = new AsyncSubject();

        // const series$ = subject.asObservable();

        // series$.subscribe(val => console.log("first sub:" + val));

        // subject.next(1);
        // subject.next(2);
        // subject.next(3);

        // // this step is essential
        // subject.complete();

        // setTimeout(()=> {
        //     series$.subscribe(val => console.log("second subscriber:" + val));
        // })

        // ReplaySubject: Will replay the complete observable to all late subscribers.
        // This logic is not linked to observable completion.

        const subject = new ReplaySubject();

        const series$ = subject.asObservable();

        series$.subscribe(val => console.log("first sub:" + val));

        subject.next(1);
        subject.next(2);
        subject.next(3);

        // this step is not essential
        subject.complete();

        setTimeout(()=> {
            series$.subscribe(val => console.log("second subscriber:" + val));
        })

    }


}






