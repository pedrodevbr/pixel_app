from flask import Blueprint, render_template, request

views = Blueprint('views',__name__)


#@views.route('/')
#def home():  
#    return render_template("fall.html")

@views.route('/')
def fall_fixed():  
    return render_template("fall_fixed.html")