import { TestBed, inject } from '@angular/core/testing';

import { ConfigurerideComponent } from './configureride.component';

describe('a configureride component', () => {
	let component: ConfigurerideComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ConfigurerideComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([ConfigurerideComponent], (ConfigurerideComponent) => {
		component = ConfigurerideComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});