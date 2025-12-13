import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormPage } from './login-form.page';

describe('LoginFormPage', () => {
  let component: LoginFormPage;
  let fixture: ComponentFixture<LoginFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
